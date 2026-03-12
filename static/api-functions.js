var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function getDestinations() {
    return __awaiter(this, void 0, void 0, function* () {
        const destinationsResponse = yield fetch("/api-destinations");
        if (!destinationsResponse.ok) {
            throw new Error("Failed to fetch destinations");
        }
        const data = yield destinationsResponse.json();
        return data;
    });
}
// Update funktion
export function getSingleDestination(destinationPk) {
    return __awaiter(this, void 0, void 0, function* () {
        const singleDestinationResponse = yield fetch(`/api-destinations/${destinationPk}`);
        if (!singleDestinationResponse.ok) {
            throw new Error("Failed to fetch destination");
        }
        const data = yield singleDestinationResponse.json();
        return data;
    });
}
export function updateDestination(destinationPk, formData) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateResponse = yield fetch(`/api-destinations/${destinationPk}`, {
            method: "PATCH",
            body: formData,
        });
        if (!updateResponse.ok) {
            throw new Error("Failed to update destination");
        }
        const data = yield updateResponse.json();
        return data;
    });
}
// Delete funktion
export function deleteDestination(destinationPk) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteResponse = yield fetch(`/api-destinations/${destinationPk}`, {
            method: "DELETE",
        });
        if (!deleteResponse.ok) {
            throw new Error("Failed to delete destination");
        }
        const data = yield deleteResponse.json();
        return data;
    });
}
