import { BaseURL } from "./baseurl";

export function RestangularConfigFactory(RestangularProvider) {
    RestangularProvider.setBaseUrl(BaseURL);
}
