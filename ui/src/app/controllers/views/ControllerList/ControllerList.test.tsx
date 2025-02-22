import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { useLocation } from "react-router";
import { MemoryRouter, Route } from "react-router-dom";
import configureStore from "redux-mock-store";

import ControllerList from "./ControllerList";
import ControllerListControls from "./ControllerListControls";

import type { RootState } from "app/store/root/types";
import { rootState as rootStateFactory } from "testing/factories";

const mockStore = configureStore();

describe("ControllerList", () => {
  let state: RootState;
  beforeEach(() => {
    state = rootStateFactory();
  });

  it("sets the search text from the URL on load", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/controllers",
              search: "?q=test+search",
              key: "testKey",
            },
          ]}
        >
          <ControllerList />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find(ControllerListControls).prop("filter")).toBe(
      "test search"
    );
  });

  it("changes the URL when the search text changes", () => {
    let search: string | null = null;
    const store = mockStore(state);
    const FetchRoute = () => {
      const location = useLocation();
      search = location.search;
      return null;
    };
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines", search: "?q=test+search", key: "testKey" },
          ]}
        >
          <ControllerList />
          <Route path="*" render={() => <FetchRoute />} />
        </MemoryRouter>
      </Provider>
    );

    act(() => {
      wrapper.find(ControllerListControls).prop("setFilter")("hostname:foo");
    });

    expect(search).toBe("?hostname=foo");
  });
});
