import { TwitchSlashCommandHandler } from "../twitch-slash-command-handler";
import { TwitchCommandHelpers } from "./twitch-command-helpers";
const twitchApi = require("../../twitch-api/api");

export const timeoutHandler: TwitchSlashCommandHandler<[string, number, string]> = {
    commands: [ "/timeout" ],
    validateArgs: ([targetUsername, duration, ...reason]) => {
        if (targetUsername == null || targetUsername.length < 1) {
            return {
                success: false,
                errorMessage: "Please provide a username"
            };
        }

        const parsedDuration = TwitchCommandHelpers.getRawDurationInSeconds(duration);
        if (parsedDuration == null) {
            return {
                success: false,
                errorMessage: "Please provide a valid duration"
            };
        }
  
        targetUsername = TwitchCommandHelpers.getNormalizedUsername(targetUsername);
        const formattedReason: string = reason == null ? null : reason.join(" ");

        return {
            success: true,
            args: [targetUsername, parsedDuration, formattedReason]
        };
    },
    handle: async ([targetUsername, duration, reason]) => {
        const targetUserId = (await twitchApi.getClient().users.getUserByName(targetUsername))?.id;

        if (targetUserId == null) {
            return false;
        }

        return await twitchApi.moderation.timeoutUser(targetUserId, duration, reason);
    }
};

export const banHandler: TwitchSlashCommandHandler<[string, string]> = {
    commands: [ "/ban" ],
    validateArgs: ([targetUsername, ...reason]) => {
        if (targetUsername == null || targetUsername.length < 1) {
            return {
                success: false,
                errorMessage: "Please provide a username"
            };
        }
  
        targetUsername = TwitchCommandHelpers.getNormalizedUsername(targetUsername);
        const formattedReason: string = reason == null ? null : reason.join(" ");

        return {
            success: true,
            args: [targetUsername, formattedReason]
        };
    },
    handle: async ([targetUsername, reason]) => {
        const targetUserId = (await twitchApi.getClient().users.getUserByName(targetUsername))?.id;

        if (targetUserId == null) {
          return false;
        }

        return await twitchApi.moderation.banUser(targetUserId, reason);
    }
};

export const unbanHandler: TwitchSlashCommandHandler<[string]> = {
    commands: [ "/unban", "/untimeout" ],
    validateArgs: ([targetUsername]) => {
        if (targetUsername == null || targetUsername.length < 1) {
            return {
                success: false,
                errorMessage: "Please provide a username"
            };
        }
  
        targetUsername = TwitchCommandHelpers.getNormalizedUsername(targetUsername);

        return {
            success: true,
            args: [targetUsername]
        };
    },
    handle: async ([targetUsername]) => {
        const targetUserId = (await twitchApi.getClient().users.getUserByName(targetUsername))?.id;

        if (targetUserId == null) {
            return false;
        }

        return await twitchApi.moderation.unbanUser(targetUserId);
    }
};

export const vipHandler: TwitchSlashCommandHandler<[string]> = {
    commands: [ "/vip" ],
    validateArgs: ([targetUsername]) => {
        if (targetUsername == null || targetUsername.length < 1) {
            return {
                success: false,
                errorMessage: "Please provide a username"
            };
        }
  
        targetUsername = TwitchCommandHelpers.getNormalizedUsername(targetUsername);

        return {
            success: true,
            args: [targetUsername]
        };
    },
    handle: async ([targetUsername]) => {
        const targetUserId = (await twitchApi.getClient().users.getUserByName(targetUsername))?.id;

        if (targetUserId == null) {
            return false;
        }

        return await twitchApi.moderation.addChannelVip(targetUserId);
    }
};

export const unvipHandler: TwitchSlashCommandHandler<[string]> = {
    commands: [ "/unvip" ],
    validateArgs: ([targetUsername]) => {
        if (targetUsername == null || targetUsername.length < 1) {
            return {
                success: false,
                errorMessage: "Please provide a username"
            };
        }
  
        targetUsername = TwitchCommandHelpers.getNormalizedUsername(targetUsername);

        return {
            success: true,
            args: [targetUsername]
        };
    },
    handle: async ([targetUsername]) => {
        const targetUserId = (await twitchApi.getClient().users.getUserByName(targetUsername))?.id;

        if (targetUserId == null) {
            return false;
        }

        return await twitchApi.moderation.removeChannelVip(targetUserId);
    }
};

export const modHandler: TwitchSlashCommandHandler<[string]> = {
    commands: [ "/mod" ],
    validateArgs: ([targetUsername]) => {
        if (targetUsername == null || targetUsername.length < 1) {
            return {
                success: false,
                errorMessage: "Please provide a username"
            };
        }
  
        targetUsername = TwitchCommandHelpers.getNormalizedUsername(targetUsername);

        return {
            success: true,
            args: [targetUsername]
        };
    },
    handle: async ([targetUsername]) => {
        const targetUserId = (await twitchApi.getClient().users.getUserByName(targetUsername))?.id;

        if (targetUserId == null) {
            return false;
        }

        return await twitchApi.moderation.addChannelModerator(targetUserId);
    }
};

export const unmodHandler: TwitchSlashCommandHandler<[string]> = {
    commands: [ "/unmod" ],
    validateArgs: ([targetUsername]) => {
        if (targetUsername == null || targetUsername.length < 1) {
            return {
                success: false,
                errorMessage: "Please provide a username"
            };
        }
  
        targetUsername = TwitchCommandHelpers.getNormalizedUsername(targetUsername);
      
        return {
            success: true,
            args: [targetUsername]
        };
    },
    handle: async ([targetUsername]) => {
        const targetUserId = (await twitchApi.getClient().users.getUserByName(targetUsername))?.id;

        if (targetUserId == null) {
            return false;
        }

        return await twitchApi.moderation.removeChannelModerator(targetUserId);
    }
};