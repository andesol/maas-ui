import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import Routes from "./Routes";

import baseURLs from "app/base/urls";
import controllersURLs from "app/controllers/urls";
import dashboardURLs from "app/dashboard/urls";
import devicesURLs from "app/devices/urls";
import domainsURLs from "app/domains/urls";
import imagesURLs from "app/images/urls";
import introURLs from "app/intro/urls";
import kvmURLs from "app/kvm/urls";
import machineURLs from "app/machines/urls";
import poolsURLs from "app/pools/urls";
import prefsURLs from "app/preferences/urls";
import settingsURLs from "app/settings/urls";
import subnetsURLs from "app/subnets/urls";
import zonesURLs from "app/zones/urls";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("Routes", () => {
  beforeEach(() => {
    global.scrollTo = jest.fn();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  [
    {
      // Redirects to machines:
      component: "Machines",
      path: baseURLs.index,
    },
    {
      component: "Intro",
      path: introURLs.index,
    },
    {
      component: "Preferences",
      path: prefsURLs.prefs,
    },
    {
      component: "Controllers",
      path: controllersURLs.controllers.index,
    },
    {
      component: "Devices",
      path: devicesURLs.devices.index,
    },
    {
      component: "Devices",
      path: devicesURLs.device.index({ id: "abc123" }),
    },
    {
      component: "Domains",
      path: domainsURLs.domains,
    },
    {
      component: "Domains",
      path: domainsURLs.details({ id: 1 }),
    },
    {
      component: "Images",
      path: imagesURLs.index,
    },
    {
      component: "KVM",
      path: kvmURLs.kvm,
    },
    {
      component: "Machines",
      path: machineURLs.machines.index,
    },
    {
      component: "MachineDetails",
      path: machineURLs.machine.index({ id: "abc123" }),
    },
    {
      component: "Machines",
      path: poolsURLs.pools,
    },
    {
      component: "Settings",
      path: settingsURLs.index,
    },
    {
      component: "Subnets",
      path: subnetsURLs.index,
    },
    {
      component: "Subnets",
      path: subnetsURLs.fabric.index({ id: 1 }),
    },
    {
      component: "Subnets",
      path: subnetsURLs.space.index({ id: 1 }),
    },
    {
      component: "Subnets",
      path: subnetsURLs.subnet.index({ id: 1 }),
    },
    {
      component: "Subnets",
      path: subnetsURLs.vlan.index({ id: 1 }),
    },
    {
      component: "NotFound",
      path: "/not/a/path",
    },
    {
      component: "Zones",
      path: zonesURLs.index,
    },
    {
      component: "Zones",
      path: zonesURLs.details({ id: 1 }),
    },
    {
      component: "Dashboard",
      path: dashboardURLs.index,
    },
  ].forEach(({ component, path }) => {
    it(`Displays: ${component} at: ${path}`, () => {
      const store = mockStore(rootStateFactory());
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: path }]}>
            <Routes />
          </MemoryRouter>
        </Provider>
      );
      expect(wrapper.find(component).exists()).toBe(true);
    });
  });
});
