import { NotificationSeverity } from "@canonical/react-components";
import pathParse from "path-parse";
import type { FileWithPath } from "react-dropzone";
import type { Dispatch } from "redux";

import { actions as messageActions } from "app/store/message";

export type ReadScriptResponse = {
  name: string | null;
  script: string;
  hasMetadata: boolean;
};

export const hasMetadata = (binaryStr: string): boolean => {
  let hasMeta = false;
  try {
    const scriptArray = binaryStr.split("\n");
    scriptArray.forEach((line) => {
      if (line.includes("--- Start MAAS 1.0 script metadata ---")) {
        hasMeta = true;
      }
    });
  } catch {
    console.error("Unable to parse script for metadata.");
    hasMeta = false;
  }
  return hasMeta;
};

export const readScript = (
  file: FileWithPath,
  dispatch: Dispatch,
  callback: (script: ReadScriptResponse | null) => void
): void => {
  const scriptName = file.path ? pathParse(file.path).name : null;

  const reader = new FileReader();

  reader.onabort = () => {
    dispatch(
      messageActions.add("Reading file aborted.", NotificationSeverity.NEGATIVE)
    );
  };
  reader.onerror = () => {
    dispatch(
      messageActions.add("Error reading file.", NotificationSeverity.NEGATIVE)
    );
  };

  reader.onload = () => {
    const binaryStr = reader.result?.toString();
    if (binaryStr) {
      const meta = hasMetadata(binaryStr);
      callback({
        name: scriptName,
        script: binaryStr,
        hasMetadata: meta,
      });
    } else {
      callback(null);
    }
  };

  reader.readAsBinaryString(file);
};

export default readScript;
