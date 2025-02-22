import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import SpaceSummaryForm from "./SpaceSummaryForm";

import { actions as spaceActions } from "app/store/space";
import {
  space as spaceFactory,
  spaceState as spaceStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const getRootState = () =>
  rootStateFactory({
    space: spaceStateFactory({
      items: [
        spaceFactory({
          name: "outer",
          description: "The cold, dark, emptiness of space.",
        }),
      ],
      loading: false,
    }),
  });

it("dispatches an update action on submit", async () => {
  const space = spaceFactory({
    name: "outer",
    description: "The cold, dark, emptiness of space.",
  });
  const state = getRootState();
  state.space.items = [space];
  const store = configureStore()(state);
  render(
    <Provider store={store}>
      <SpaceSummaryForm space={space} handleDismiss={jest.fn()} />
    </Provider>
  );
  const spaceSummaryForm = screen.getByRole("form", {
    name: "Edit space summary",
  });
  userEvent.clear(screen.getByLabelText("Name"));
  userEvent.clear(screen.getByLabelText("Description"));
  userEvent.type(screen.getByLabelText("Name"), "new name");
  userEvent.type(screen.getByLabelText("Description"), "new description");
  userEvent.click(
    within(spaceSummaryForm).getByRole("button", { name: "Save" })
  );

  await waitFor(() =>
    expect(store.getActions()).toStrictEqual([
      spaceActions.update({
        id: space.id,
        name: "new name",
        description: "new description",
      }),
    ])
  );
});
