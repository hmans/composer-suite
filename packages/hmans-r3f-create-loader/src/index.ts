import { LoaderResult, useLoader } from "@react-three/fiber"

/**
 * Creates and returns a loader hook for the given asset, and immediately
 * queues the asset for preloading.
 *
 * @param loader The loader class to use for loading the asset.
 * @param url The URL of the asset.
 * @returns The loader hook you can use in your component to access the asset.
 */
export const createLoader = <R>(
  loader: new () => LoaderResult<R>,
  url: string
) => {
  useLoader.preload(loader, url)
  return () => useLoader(loader, url)
}
