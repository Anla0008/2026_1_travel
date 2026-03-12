var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDestinations, deleteDestination } from "./api-functions.js";
function loadDestinations() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const container = document.getElementById("destinations");
        if (!container)
            return;
        const destinations = yield getDestinations();
        container.innerHTML = "";
        for (const destination of destinations) {
            const dateFrom = new Date(destination.destination_date_from).toISOString().split("T")[0];
            const dateTo = new Date(destination.destination_date_to).toISOString().split("T")[0];
            const isOwner = loggedInUserPk && destination.user_fk === loggedInUserPk;
            container.innerHTML += `
      <article class="destination-card" id="destination_${destination.destination_pk}">
        <h2>${destination.destination_title}</h2>
        <p><strong>Location:</strong> ${destination.destination_location}, ${destination.destination_country}</p>
        <p><strong>From:</strong> ${dateFrom}</p>
        <p><strong>To:</strong> ${dateTo}</p>
        <p>${(_a = destination.destination_description) !== null && _a !== void 0 ? _a : ""}</p>

        <div class="destination-actions">
          <a href="/destination/${destination.destination_pk}" class="destination-action">
            View destination
          </a>

          ${isOwner
                ? `
                <a href="/destination/${destination.destination_pk}" class="destination-action">
                  Edit
                </a>
                <button class="destination-action delete-btn" data-id="${destination.destination_pk}" type="button">
                  Delete
                </button>
              `
                : ""}
        </div>
      </article>
    `;
        }
        const deleteButtons = document.querySelectorAll(".delete-btn");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const destinationPk = button.dataset.id;
                if (!destinationPk)
                    return;
                const confirmed = confirm("Are you sure you want to delete this destination?");
                if (!confirmed)
                    return;
                yield deleteDestination(destinationPk);
                const destinationElement = document.getElementById(`destination_${destinationPk}`);
                destinationElement === null || destinationElement === void 0 ? void 0 : destinationElement.remove();
            }));
        });
    });
}
loadDestinations();
