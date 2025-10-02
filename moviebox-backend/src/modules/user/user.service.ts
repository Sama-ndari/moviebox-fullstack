// users/users.service.ts
import { Injectable, NotFoundException, BadRequestException, ConflictException, forwardRef, Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto, QueryUsersDto, UpdateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Person, PersonDocument } from '../person/entities/person.entity';
import { UserPreferences } from '../user-preferences/entities/user-preferences.entity';
import { CommonHelpers } from '../../helpers/helpers';
import { ResponseService } from '../../helpers/respon-server/ResponseServer';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Person.name) private personModel: Model<PersonDocument>,
        @InjectModel(UserPreferences.name) private userPreferencesModel: Model<UserPreferences>,
        private readonly responseService: ResponseService,
        @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
    ) { }

    async create(createUserDto: CreateUserDto) {
        this.logger.log(`[create] Creating user with username: ${createUserDto.username}, email: ${createUserDto.email}`);
        try {
            const { email, username } = createUserDto;

            this.logger.log(`[create] Checking for existing user with email or username`);
            const existingUser = await CommonHelpers.retry(() => this.userModel.findOne({ $or: [{ email }, { username }] }).exec());
            if (existingUser) {
                if (existingUser.email === email) {
                    this.logger.error(`[create] Email already in use: ${email}`);
                    throw new ConflictException('Email already in use');
                } else {
                    this.logger.error(`[create] Username already in use: ${username}`);
                    throw new ConflictException('Username already in use');
                }
            }

            this.logger.log(`[create] No conflicts found, creating new user`);
            const createdUser = new this.userModel(createUserDto);
            const savedUser = await CommonHelpers.retry(() => createdUser.save());
            this.logger.log(`[create] User created successfully with ID: ${savedUser._id}`);
            
            await CommonHelpers.invalidateCacheByPattern('users:*');
            this.logger.log(`[create] Cache invalidated`);
            return savedUser;
        } catch (error) {
            this.logger.error(`[create] Error creating user: ${error.message}`, error.stack);
            // Re-throw the error to be handled by the calling service
            throw error;
        }
    }

    async findAll(queryDto: QueryUsersDto) {
        this.logger.log(`[findAll] Finding all users with query: ${JSON.stringify(queryDto)}`);
        const cacheKey = `users:all:${JSON.stringify(queryDto)}`;
        const fetchFn = async () => {
            const { page = 1, limit = 10, role, username, email, sortBy = 'createdAt', sortDirection = 'desc' } = queryDto;
            const skip = (page - 1) * limit;
            const filter: any = {};
            if (role) filter.role = role;
            if (username) filter.username = { $regex: username, $options: 'i' };
            if (email) filter.email = { $regex: email, $options: 'i' };
            const sort: any = { [sortBy]: sortDirection === 'asc' ? 1 : -1 };

            this.logger.log(`[findAll] Fetching users from database with filter: ${JSON.stringify(filter)}`);
            const [users, total] = await Promise.all([
                this.userModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
                this.userModel.countDocuments(filter).exec(),
            ]);

            this.logger.log(`[findAll] Found ${users.length} users out of ${total} total`);
            const sanitizedUsers = users.map(user => this.sanitizeUser(user));
            return { data: sanitizedUsers, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
        };

        try {
            const result = await CommonHelpers.cacheOrFetch(cacheKey, fetchFn);
            this.logger.log(`[findAll] Returning ${result.data.length} users`);
            return this.responseService.responseSuccess(result);
        } catch (error) {
            this.logger.error(`[findAll] Error finding users: ${error.message}`, error.stack);
            return this.responseService.responseError(error.message);
        }
    }

    async findMany(userIds: string[]): Promise<UserDocument[]> {
        this.logger.log(`[findMany] Finding multiple users with IDs: ${userIds.join(', ')}`);
        const validIds = userIds.filter((id) => Types.ObjectId.isValid(id));
        this.logger.log(`[findMany] ${validIds.length} valid IDs out of ${userIds.length}`);

        if (validIds.length === 0) {
            this.logger.error(`[findMany] No valid user IDs provided`);
            throw new BadRequestException('No valid user IDs provided');
        }

        this.logger.log(`[findMany] Fetching users from database`);
        const users = await this.userModel.find({ _id: { $in: validIds } }).exec();

        if (users.length === 0) {
            this.logger.error(`[findMany] No users found for the provided IDs`);
            throw new NotFoundException('No users found for the provided IDs');
        }

        this.logger.log(`[findMany] Found ${users.length} users`);
        return users;
    }

    async findOne(id: string) {
        this.logger.log(`[findOne] Finding user with ID: ${id}`);
        if (!Types.ObjectId.isValid(id)) {
            this.logger.error(`[findOne] Invalid user ID format: ${id}`);
            return this.responseService.responseError(`Invalid user ID: ${id}`);
        }
        const cacheKey = `user:${id}`;
        const fetchFn = async () => {
            this.logger.log(`[findOne] Fetching user ${id} from database`);
            const user = await this.userModel.findById(id).exec();
            if (!user) {
                this.logger.error(`[findOne] User with ID ${id} not found in database`);
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            this.logger.log(`[findOne] User ${id} found successfully`);
            return this.sanitizeUser(user);
        };

        try {
            const user = await CommonHelpers.cacheOrFetch(cacheKey, fetchFn);
            this.logger.log(`[findOne] Returning user ${id} data`);
            return this.responseService.responseSuccess(user);
        } catch (error) {
            this.logger.error(`[findOne] Error finding user ${id}: ${error.message}`, error.stack);
            return this.responseService.responseError(error.message);
        }
    }

    async findByUsername(username: string): Promise<UserDocument> {
        this.logger.log(`[findByUsername] Finding user with username: ${username}`);
        const user = await this.userModel.findOne({ username }).exec();

        if (!user) {
            this.logger.error(`[findByUsername] User with username ${username} not found`);
            throw new NotFoundException(`User with username ${username} not found`);
        }

        this.logger.log(`[findByUsername] User found: ${user._id}`);
        return user;
    }

    async findByEmail(email: string): Promise<UserDocument> {
        this.logger.log(`[findByEmail] Finding user with email: ${email}`);
        const user = await this.userModel.findOne({ email }).exec();

        if (!user) {
            this.logger.error(`[findByEmail] User with email ${email} not found`);
            throw new NotFoundException(`User with email ${email} not found`);
        }

        this.logger.log(`[findByEmail] User found: ${user._id}`);
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        this.logger.log(`[update] Updating user ${id} with data: ${JSON.stringify(updateUserDto)}`);
        if (!Types.ObjectId.isValid(id)) {
            this.logger.error(`[update] Invalid user ID format: ${id}`);
            return this.responseService.responseError(`Invalid user ID: ${id}`);
        }
        try {
            if (updateUserDto.email) {
                this.logger.log(`[update] Checking if email ${updateUserDto.email} is already in use`);
                const existingUser = await this.userModel.findOne({ email: updateUserDto.email, _id: { $ne: id } }).exec();
                if (existingUser) {
                    this.logger.error(`[update] Email ${updateUserDto.email} already in use`);
                    throw new ConflictException('Email already in use');
                }
            }

            if (updateUserDto.username) {
                this.logger.log(`[update] Checking if username ${updateUserDto.username} is already in use`);
                const existingUser = await this.userModel.findOne({ username: updateUserDto.username, _id: { $ne: id } }).exec();
                if (existingUser) {
                    this.logger.error(`[update] Username ${updateUserDto.username} already in use`);
                    throw new ConflictException('Username already in use');
                }
            }

            this.logger.log(`[update] Updating user ${id} in database`);
            const updatedUser = await CommonHelpers.retry(() => this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec());
            if (!updatedUser) {
                this.logger.error(`[update] User with ID ${id} not found`);
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            this.logger.log(`[update] User ${id} updated successfully`);
            await CommonHelpers.invalidateCache([`user:${id}`]);
            await CommonHelpers.invalidateCacheByPattern('users:*');
            this.logger.log(`[update] Cache invalidated`);
            return this.responseService.responseUpdateSuccess('User updated successfully', this.sanitizeUser(updatedUser));
        } catch (error) {
            this.logger.error(`[update] Error updating user ${id}: ${error.message}`, error.stack);
            return this.responseService.responseError(error.message);
        }
    }

    async remove(id: string) {
        this.logger.log(`[remove] Removing user with ID: ${id}`);
        if (!Types.ObjectId.isValid(id)) {
            this.logger.error(`[remove] Invalid user ID format: ${id}`);
            return this.responseService.responseError(`Invalid user ID: ${id}`);
        }
        try {
            this.logger.log(`[remove] Deleting user ${id} from database`);
            const result = await CommonHelpers.retry(() => this.userModel.findByIdAndDelete(id).exec());
            if (!result) {
                this.logger.error(`[remove] User with ID ${id} not found`);
                throw new NotFoundException(`User with ID ${id} not found`);
            }

            this.logger.log(`[remove] User ${id} deleted successfully`);
            await CommonHelpers.invalidateCache([`user:${id}`]);
            await CommonHelpers.invalidateCacheByPattern('users:*');
            this.logger.log(`[remove] Cache invalidated`);
            return this.responseService.responseDeleteSuccess('User deleted successfully', null);
        } catch (error) {
            this.logger.error(`[remove] Error removing user ${id}: ${error.message}`, error.stack);
            return this.responseService.responseError(error.message);
        }
    }

    sanitizeUser(user: UserDocument): Partial<User> {
        const sanitized = user.toObject();
        delete sanitized.password;
        return sanitized;
    }

    async getPreferences(userId: string) {
        this.logger.log(`[getPreferences] Getting preferences for user: ${userId}`);
        const cacheKey = `user:${userId}:preferences`;
        const fetchFn = async () => {
            this.logger.log(`[getPreferences] Fetching preferences from database for user: ${userId}`);
            const preferences = await this.userPreferencesModel.findOne({ user: userId }).exec();
            if (!preferences) {
                this.logger.log(`[getPreferences] No preferences found for user ${userId}, creating default preferences`);
                return this.userPreferencesModel.create({
                    user: userId,
                    contentTypes: ['Movies', 'TVShows'],
                    genres: ['Action', 'Drama'],
                    notificationFrequency: 'Instant',
                    deliveryMethods: ['InApp', 'Email'],
                });
            }
            this.logger.log(`[getPreferences] Preferences found for user ${userId}`);
            return preferences;
        };

        try {
            const preferences = await CommonHelpers.cacheOrFetch(cacheKey, fetchFn);
            this.logger.log(`[getPreferences] Returning preferences for user ${userId}`);
            return this.responseService.responseSuccess(preferences);
        } catch (error) {
            this.logger.error(`[getPreferences] Error getting preferences for user ${userId}: ${error.message}`, error.stack);
            return this.responseService.responseError(error.message);
        }
    }

    async follow(userId: string, followId: string) {
        this.logger.log(`[follow] User ${userId} attempting to follow user ${followId}`);
        
        if (userId === followId) {
            this.logger.error(`[follow] User ${userId} attempted to follow themselves`);
            throw new BadRequestException('You cannot follow yourself.');
        }

        try {
            this.logger.log(`[follow] Updating following list for user ${userId}`);
            await this.userModel.updateOne({ _id: userId, following: { $ne: followId } }, { $push: { following: followId } }).exec();
            
            this.logger.log(`[follow] Updating followers list for user ${followId}`);
            await this.userModel.updateOne({ _id: followId, followers: { $ne: userId } }, { $push: { followers: userId } }).exec();

            this.logger.log(`[follow] Fetching follower user data for user ${userId}`);
            const followerResponse = await this.findOne(userId);
            if (followerResponse.statusCode !== 200) {
                this.logger.error(`[follow] Failed to fetch follower data, status: ${followerResponse.statusCode}`);
                return;
            }
            const follower = followerResponse.data;
            this.logger.log(`[follow] Follower data retrieved: ${follower.username}`);

            this.logger.log(`[follow] Sending notification to user ${followId}`);
            await this.notificationService.notifyUser({
                userId: followId,
                senderId: userId,
                type: NotificationType.NEW_FOLLOWER,
                message: `${follower.username} started following you.`,
            });

            this.logger.log(`[follow] Invalidating cache for users ${userId} and ${followId}`);
            await CommonHelpers.invalidateCache([`user:${userId}`, `user:${followId}`]);
            await CommonHelpers.invalidateCacheByPattern(`user:*`);
            
            this.logger.log(`[follow] User ${userId} successfully followed user ${followId}`);
            return this.responseService.responseSuccess({ message: 'User followed successfully' });
        } catch (error) {
            this.logger.error(`[follow] Error in follow operation: ${error.message}`, error.stack);
            return this.responseService.responseError(error.message);
        }
    }

    async unfollow(userId: string, unfollowId: string) {
        this.logger.log(`[unfollow] User ${userId} attempting to unfollow user ${unfollowId}`);
        
        try {
            this.logger.log(`[unfollow] Removing ${unfollowId} from ${userId}'s following list`);
            await this.userModel.updateOne({ _id: userId }, { $pull: { following: unfollowId } }).exec();
            
            this.logger.log(`[unfollow] Removing ${userId} from ${unfollowId}'s followers list`);
            await this.userModel.updateOne({ _id: unfollowId }, { $pull: { followers: userId } }).exec();

            this.logger.log(`[unfollow] Invalidating cache for users ${userId} and ${unfollowId}`);
            await CommonHelpers.invalidateCache([`user:${userId}`, `user:${unfollowId}`]);
            await CommonHelpers.invalidateCacheByPattern(`user:*`);
            
            this.logger.log(`[unfollow] User ${userId} successfully unfollowed user ${unfollowId}`);
            return this.responseService.responseSuccess({ message: 'User unfollowed successfully' });
        } catch (error) {
            this.logger.error(`[unfollow] Error in unfollow operation: ${error.message}`, error.stack);
            return this.responseService.responseError(error.message);
        }
    }
}