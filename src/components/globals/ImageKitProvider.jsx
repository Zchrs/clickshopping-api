/* eslint-disable react/prop-types */
import { IKContext } from "imagekitio-react";

export const ImageKitProvider = ({ children }) => {
  return (
    <IKContext
      publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      authenticationEndpoint={
        import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT
      }
      transformationPosition="path"
    >
      {children}
    </IKContext>
  );
};