export async function getDestinations() {
  const destinationsResponse = await fetch("/api-destinations");

  if (!destinationsResponse.ok) {
    throw new Error("Failed to fetch destinations");
  }
  const data = await destinationsResponse.json();
  return data;
}

export async function getSingleDestination(destinationPk: string) {
  const singleDestinationResponse = await fetch(`/api-destinations/${destinationPk}`);

  if (!singleDestinationResponse.ok) {
    throw new Error("Failed to fetch destination");
  }

  const data = await singleDestinationResponse.json();
  return data;
}

export async function updateDestination(destinationPk: string, formData: FormData) {
  const updateResponse = await fetch(`/api-destinations/${destinationPk}`, {
    method: "PATCH",
    body: formData,
  });
  if (!updateResponse.ok) {
    throw new Error("Failed to update destination");
  }

  const data = await updateResponse.json();
  return data;
}
