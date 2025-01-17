import { initRemote } from "./obs-remote";
import { TypedEmitter } from "tiny-typed-emitter";
import eventManager from "../../../events/EventManager";
import {
  Integration,
  IntegrationController,
  IntegrationData,
  IntegrationEvents,
} from "@crowbartools/firebot-custom-scripts-types";
import { EventManager } from "@crowbartools/firebot-custom-scripts-types/types/modules/event-manager";
import logger from "../../../logwrapper";
import { ChangeSceneEffectType } from "./effects/change-scene-effect-type";
import { ChangeSceneCollectionEffectType } from "./effects/change-scene-collection";
import { ToggleSourceVisibilityEffectType } from "./effects/toggle-obs-source-visibility";
import { ToggleSourceFilterEffectType } from "./effects/toggle-obs-source-filter";
import { ToggleSourceMutedEffectType } from "./effects/toggle-obs-source-muted";
import { StartStreamEffectType } from "./effects/start-stream";
import { StopStreamEffectType } from "./effects/stop-stream";
import { StartVirtualCamEffectType } from "./effects/start-virtual-cam";
import { StopVirtualCamEffectType } from "./effects/stop-virtual-cam";
import { OBSEventSource } from "./events/obs-event-source";
import { SceneNameEventFilter } from "./filters/scene-name-filter";
import { SceneNameVariable } from "./variables/scene-name-variable";
import { SceneCollectionNameVariable } from "./variables/scene-collection-name-variable";
import { setupFrontendListeners } from "./communicator";
import effectManager from "../../../effects/effectManager";
import eventFilterManager from "../../../events/filters/filter-manager";
import replaceVariableManager from "../../../variables/replace-variable-manager";
import * as frontendCommunicator from "../../../common/frontend-communicator";

type ObsSettings = {
  websocketSettings: {
    ipAddress: string;
    port: number;
    password: string;
  };
  misc: {
    logging: boolean;
  };
};

class IntegrationEventEmitter extends TypedEmitter<IntegrationEvents> {}

class ObsIntegration
  extends IntegrationEventEmitter
  implements IntegrationController<ObsSettings>
{
  connected = false;

  constructor(private readonly eventManager: EventManager) {
    super();
  }

  private setupConnection(settings?: ObsSettings) {
    if (!settings) {
      return;
    }
    const {
      websocketSettings: { ipAddress, password, port },
      misc: { logging },
    } = settings;
    initRemote(
      {
        ip: ipAddress,
        port,
        password,
        logging,
        forceConnect: true,
      },
      {
        eventManager: this.eventManager,
      }
    );
  }

  init(
    linked: boolean,
    integrationData: IntegrationData<ObsSettings>
  ): void | PromiseLike<void> {
    logger.info("Starting OBS Control...");

    setupFrontendListeners(frontendCommunicator);

    effectManager.registerEffect(ChangeSceneEffectType);
    effectManager.registerEffect(ChangeSceneCollectionEffectType);
    effectManager.registerEffect(ToggleSourceVisibilityEffectType);
    effectManager.registerEffect(ToggleSourceFilterEffectType);
    effectManager.registerEffect(ToggleSourceMutedEffectType);
    effectManager.registerEffect(StartStreamEffectType);
    effectManager.registerEffect(StopStreamEffectType);
    effectManager.registerEffect(StartVirtualCamEffectType);
    effectManager.registerEffect(StopVirtualCamEffectType);

    eventManager.registerEventSource(OBSEventSource);

    eventFilterManager.registerFilter(SceneNameEventFilter);

    replaceVariableManager.registerReplaceVariable(SceneNameVariable);
    replaceVariableManager.registerReplaceVariable(SceneCollectionNameVariable);

    this.setupConnection(integrationData.userSettings);
  }

  onUserSettingsUpdate?(
    integrationData: IntegrationData<ObsSettings>
  ): void | PromiseLike<void> {
    this.setupConnection(integrationData.userSettings);
  }
}

const integrationConfig: Integration<ObsSettings> = {
  definition: {
    id: "OBS",
    name: "OBS",
    description:
      "Connect to OBS to allow Firebot to change scenes, toggle sources and filters, and much more. Requires OBS 28+ or the obs-websocket v5 plugin.",
    linkType: "none",
    configurable: true,
    connectionToggle: false,
    settingCategories: {
      websocketSettings: {
        title: "Websocket Settings",
        sortRank: 1,
        settings: {
          ipAddress: {
            title: "IP Address",
            description:
              "The ip address of the computer running OBS. Use 'localhost' for the same computer.",
            type: "string",
            default: "localhost",
          },
          port: {
            title: "Port",
            description:
              "Port the OBS Websocket is running on. Default is 4455.",
            type: "number",
            default: 4455,
          },
          password: {
            title: "Password",
            description: "The password set for the OBS Websocket.",
            type: "password",
            default: "",
          },
        },
      },
      misc: {
        title: "Misc",
        sortRank: 2,
        settings: {
          logging: {
            title: "Enable logging for OBS Errors",
            type: "boolean",
            default: false,
          },
        },
      },
    },
  },
  integration: new ObsIntegration(eventManager),
};

export const definition = integrationConfig.definition;
export const integration = integrationConfig.integration;
