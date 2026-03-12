var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDestinations } from "./api-functions.js";
function loadDestinations() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const container = document.getElementById("destinations");
        if (!container)
            return;
        const destinations = yield getDestinations();
        container.innerHTML = "";
        for (const destination of destinations) {
            container.innerHTML += `
        <article>
        <h2>${destination.destination_title}</h2>
        <p>From: ${destination.destination_date_from}</p>
        <p>To: ${destination.destination_date_to}</p>
        <p>${(_a = destination.destination_description) !== null && _a !== void 0 ? _a : ""}</p>
        <p>${destination.destination_location}, ${destination.destination_country}</p>
      </article>
      <hr>
    `;
        }
    });
}
loadDestinations();
