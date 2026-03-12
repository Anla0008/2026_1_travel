var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSingleDestination, updateDestination, deleteDestination } from "./api-functions.js";
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
        // const deleteButton = document.getElementById("delete_destination_btn") as HTMLButtonElement;
        // const updateButton = document.getElementById("update_destination_btn") as HTMLButtonElement;
        // if (loggedInUserPk && destination.user_fk === loggedInUserPk) {
        //   deleteButton.hidden = false;
        //   updateButton.hidden = false;
        // }
        const ownerActions = document.getElementById("destination_owner_actions");
        if (loggedInUserPk && destination.user_fk === loggedInUserPk) {
            ownerActions.innerHTML = `
    <button id="update_destination_btn" type="submit">Update destination</button>
    <button id="delete_destination_btn" type="button">Delete destination</button>
  `;
            const deleteButton = document.getElementById("delete_destination_btn");
            deleteButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const confirmed = confirm("Are you sure you want to delete this destination?");
                if (!confirmed)
                    return;
                yield deleteDestination(destinationPk);
                window.location.href = "/destinations";
            }));
        }
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
function handleDeleteDestination() {
    return __awaiter(this, void 0, void 0, function* () {
        const confirmed = confirm("Are you sure you want to delete this destination?");
        if (!confirmed)
            return;
        const destinationPk = window.location.pathname.split("/").pop();
        yield deleteDestination(destinationPk);
        window.location.href = "/destinations";
    });
}
const deleteButton = document.getElementById("delete_destination_btn");
if (deleteButton) {
    deleteButton.addEventListener("click", handleDeleteDestination);
}
loadSingleDestination();
