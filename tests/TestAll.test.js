import BaseTestGroup                       from "./BaseTestGroup";
import TestApp                             from "./application/Test-App";
import { TestGroupAgentProductionHelpers } from "./application/agent-production/TestGroup-AgentProduction-Helpers";
import { TestGroupCommonHelpers }          from "./application/common/TestGroup-Common-Helpers";
import { TestGroupCommonComponents }       from './application/common/components/TestGroup-Components';
import { TestGroupMarketDynamicsHelpers }  from "./application/market-dynamics/TestGroup-MarketDynamics-Helpers";
import { TestGroupMarketShareHelpers }     from "./application/market-share/TestGroup-MarketShare-Helpers";

const testGroup = new BaseTestGroup(
    [
        new TestApp(),
        new TestGroupAgentProductionHelpers(),
        new TestGroupCommonComponents(),
        new TestGroupCommonHelpers(),
        new TestGroupMarketShareHelpers(),
        new TestGroupMarketDynamicsHelpers()
    ]
);

testGroup.test();
