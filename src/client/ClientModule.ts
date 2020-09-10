import {Container, LoggerFactory, Module} from "ferrum-plumbing";
import {AuthenticationContext} from "../common/AuthenticationContext";
import {UnifyreExtensionKitClient, UnifyreExtensionKitClientImpl} from "./UnifyreExtensionKitClient";
import {ServerApi} from "../common/ServerApi";
import {WalletJsonRpcClient} from "./WalletJsonRpcClient";
import {AsyncRequestRepeater} from "./AsyncRequestRepeater";

/**
 * Initializes a client module. The app that uses this module must register two types:
 * JsonStorage, and LoggerFactory. Plus it should pass in apiUrl, and appId
 */
export class ClientModule implements Module {
  constructor(private apiUrl: string, private appId: string) {
  }

  async configAsync(c: Container): Promise<void> {
    c.registerSingleton(AuthenticationContext, () => new AuthenticationContext());
    c.registerSingleton(UnifyreExtensionKitClient, c => new UnifyreExtensionKitClientImpl(
      c.get(ServerApi), c.get(WalletJsonRpcClient), this.appId));
    c.registerSingleton(ServerApi, c => new ServerApi(c.get('JsonStorage'),
      c.get(LoggerFactory), c.get(AuthenticationContext), this.apiUrl));
    c.registerSingleton(AsyncRequestRepeater, () => new AsyncRequestRepeater());
    c.register(WalletJsonRpcClient, c => new WalletJsonRpcClient(c.get(ServerApi), c.get(AsyncRequestRepeater)));
  }
}