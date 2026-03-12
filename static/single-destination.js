var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSingleDestination, updateDestination } from "./api-functions.js";
function loadSingleDestination() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const destinationPk = window.location.pathname.split("/").pop();
        const destination = yield getSingleDestination(destinationPk);
        document.getElementById("destination_pk").value = destination.destination_pk;
        document.getElementById("destination_title").value = destination.destination_title;
        document.getElementById("destination_date_from").value = new Date(destination.destination_date_from).toISOString().split("T")[0];
        document.getElementById("destination_date_to").value = new Date(destination.destination_date_to).toISOString().split("T")[0];
        document.getElementById("destination_description").value = (_a = destination.destination_description) !== null && _a !== void 0 ? _a : "";
        document.getElementById("destination_location").value = destination.destination_location;
        document.getElementById("destination_country").value = destination.destination_country;
    });
}
function handleUpdateDestination(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const form = document.getElementById("edit_destination_form");
        const destinationPk = window.location.pathname.split("/").pop();
        const formData = new FormData(form);
        yield updateDestination(destinationPk, formData);
        alert("Destination updated");
    });
}
const form = document.getElementById("edit_destination_form");
if (form) {
    form.addEventListener("submit", handleUpdateDestination);
}
loadSingleDestination();
