import axios from "axios";
import { METHODS, STATUSES } from "../types/enums";
import { DishesJson } from "../types/types";

const makeRequest = (url: string, data: {}, method: METHODS) => {
  const headers = {};
  const config = {
    url,
    method,
    headers,
    data: data,
  };
  return axios.request(config);
};

const getDishesInformation = async () => {
  return new Promise<DishesJson>((resolve, reject) => {
    const url = "./dishes.json";
    makeRequest(url, {}, METHODS.GET)
      .then((response) => {
        if (response.status != STATUSES.SUCCESS) {
          reject("Could not fetch dishes data");
          return;
        }
        resolve(response.data);
      })
      .catch(reject);
  });
};

export { getDishesInformation };
