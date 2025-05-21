"use strict";

import { Image, requireNativeComponent } from "react-native";
import { jsx as _jsx } from "react/jsx-runtime";
export const NATIVE_MODULE_NAME = "MLRNImages";
function _isUrlOrPath(value) {
  return (typeof value === "string" || value instanceof String) && (value.startsWith("file://") || value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:") || value.startsWith("asset://") || value.startsWith("/"));
}
function _isImageSourcePropType(value) {
  if (typeof value === "number" || value instanceof Number) {
    return true;
  }
  const valueAsSource = value;
  return !!valueAsSource.uri && typeof valueAsSource.uri === "string";
}
/**
 * Images defines the images used in Symbol etc layers
 */
export const Images = ({
  images,
  nativeAssetImages,
  onImageMissing,
  id,
  children
}) => {
  const _getImages = () => {
    if (!images && !nativeAssetImages) {
      return {};
    }
    const imagesResult = {};
    let nativeImages = [];
    if (images) {
      const imageNames = Object.keys(images);
      for (const imageName of imageNames) {
        const value = images[imageName];
        if (value && _isUrlOrPath(value)) {
          imagesResult[imageName] = value;
        } else if (value && _isImageSourcePropType(value)) {
          const res = Image.resolveAssetSource(value);
          if (res && res.uri) {
            imagesResult[imageName] = res;
          }
        }
      }
    }
    if (nativeAssetImages) {
      nativeImages = nativeAssetImages;
    }
    return {
      images: imagesResult,
      nativeImages
    };
  };
  const _onImageMissing = event => {
    if (onImageMissing) {
      onImageMissing(event.nativeEvent.payload.imageKey);
    }
  };
  const props = {
    id,
    hasOnImageMissing: !!onImageMissing,
    onImageMissing: _onImageMissing,
    ..._getImages()
  };
  return /*#__PURE__*/_jsx(MLRNImages, {
    ...props,
    children: children
  });
};
const MLRNImages = requireNativeComponent(NATIVE_MODULE_NAME);
//# sourceMappingURL=Images.js.map