import { useState } from "react";

import { Spinner, Strip } from "@canonical/react-components";

import type { FormikFormProps } from "app/base/components/FormikForm";
import FormikForm from "app/base/components/FormikForm";
import { useProcessing } from "app/base/hooks";
import { NodeActions } from "app/store/types/node";

const getLabel = (
  modelName: string,
  actionName: string,
  selectedCount: number,
  processingCount?: number
) => {
  const processing =
    typeof processingCount === "number" && processingCount >= 0;

  // e.g. "machine"
  let modelString = modelName;
  if (processing && selectedCount > 1) {
    // e.g.  "1 of 2 machines"
    modelString = `${
      selectedCount - (processingCount || 0)
    } of ${selectedCount} ${modelName}s`;
  } else if (selectedCount > 1) {
    // e.g. "2 machines"
    modelString = `${selectedCount} ${modelName}s`;
  }

  switch (actionName) {
    case NodeActions.ABORT:
      return `${processing ? "Aborting" : "Abort"} actions for ${modelString}`;
    case NodeActions.ACQUIRE:
      return `${processing ? "Acquiring" : "Acquire"} ${modelString}`;
    case NodeActions.CLONE:
      return processing ? "Cloning in progress" : `Clone to ${modelString}`;
    case NodeActions.COMMISSION:
      return `${
        processing ? "Starting" : "Start"
      } commissioning for ${modelString}`;
    case "compose":
      return `${processing ? "Composing" : "Compose"} ${modelString}`;
    case NodeActions.DELETE:
      return `${processing ? "Deleting" : "Delete"} ${modelString}`;
    case NodeActions.DEPLOY:
      return `${
        processing ? "Starting" : "Start"
      } deployment for ${modelString}`;
    case NodeActions.EXIT_RESCUE_MODE:
      return `${
        processing ? "Exiting" : "Exit"
      } rescue mode for ${modelString}`;
    case NodeActions.IMPORT_IMAGES:
      return `${
        processing ? "Importing images" : "Import images"
      } for ${modelString}`;
    case NodeActions.LOCK:
      return `${processing ? "Locking" : "Lock"} ${modelString}`;
    case NodeActions.ON:
      return `${processing ? "Powering" : "Power"} on ${modelString}`;
    case NodeActions.OFF:
      return `${processing ? "Powering" : "Power"} off ${modelString}`;
    case NodeActions.MARK_BROKEN:
      return `${processing ? "Marking" : "Mark"} ${modelString} broken`;
    case NodeActions.MARK_FIXED:
      return `${processing ? "Marking" : "Mark"} ${modelString} fixed`;
    case NodeActions.OVERRIDE_FAILED_TESTING:
      return `${
        processing ? "Overriding" : "Override"
      } failed tests for ${modelString}`;
    case NodeActions.RELEASE:
      return `${processing ? "Releasing" : "Release"} ${modelString}`;
    case "refresh":
      return `${processing ? "Refreshing" : "Refresh"} ${modelString}`;
    case "remove":
      return `${processing ? "Removing" : "Remove"} ${modelString}`;
    case NodeActions.RESCUE_MODE:
      return `${
        processing ? "Entering" : "Enter"
      } rescue mode for ${modelString}`;
    case NodeActions.SET_POOL:
      return `${processing ? "Setting" : "Set"} pool for ${modelString}`;
    case NodeActions.SET_ZONE:
      return `${processing ? "Setting" : "Set"} zone for ${modelString}`;
    case NodeActions.TAG:
      return `${processing ? "Tagging" : "Tag"} ${modelString}`;
    case NodeActions.TEST:
      return `${processing ? "Starting" : "Start"} tests for ${modelString}`;
    case NodeActions.UNLOCK:
      return `${processing ? "Unlocking" : "Unlock"} ${modelString}`;
    default:
      return `${processing ? "Processing" : "Process"} ${modelString}`;
  }
};

export type Props<V, E = null> = Omit<
  FormikFormProps<V, E>,
  "buttonsAlign" | "saved" | "saving" | "savingLabel" | "submitLabel"
> & {
  actionName: string;
  loaded?: boolean;
  modelName: string;
  processingCount: number;
  selectedCount: number;
};

const ActionForm = <V, E = null>({
  actionName,
  buttonsBordered = false,
  children,
  errors,
  loaded = true,
  modelName,
  onSubmit,
  processingCount,
  selectedCount,
  ...formikFormProps
}: Props<V, E>): JSX.Element | null => {
  const [selectedOnSubmit, setSelectedOnSubmit] = useState(selectedCount);
  const processingComplete = useProcessing({
    hasErrors: !!errors,
    processingCount,
  });

  if (!loaded) {
    return (
      <Strip>
        <Spinner text="Loading..." />
      </Strip>
    );
  }

  return (
    <FormikForm<V, E>
      buttonsAlign="right"
      buttonsBordered={buttonsBordered}
      errors={errors}
      onSubmit={(values?, formikHelpers?) => {
        onSubmit(values, formikHelpers);
        // Set selected count in component state once form is submitted, so
        // that the saving label is not affected by updates to the component's
        // selectedCount prop, e.g. unselecting or deleting items.
        setSelectedOnSubmit(selectedCount);
      }}
      saved={processingComplete}
      saving={processingCount > 0}
      savingLabel={`${getLabel(
        modelName,
        actionName,
        selectedOnSubmit,
        processingCount
      )}...`}
      submitLabel={getLabel(modelName, actionName, selectedCount)}
      {...formikFormProps}
    >
      {children}
    </FormikForm>
  );
};

export default ActionForm;
