const deleteButtons = document.querySelectorAll(".button-delete");

deleteButtons.forEach((button) => {
	button.addEventListener("click", async (event) => {
		const personId = event.target.dataset.personId;
		const sessionList = event.target.closest(".session-list");
		try {
			let response = await fetch(`/session/delete/${personId}`, { method: "DELETE" });

			if (response.ok) {
				let sessionCardToBeDeleted = event.target.closest(".session-card");
                if (!sessionCardToBeDeleted) {
                    throw new Error("Session card not found in DOM");
                }
                sessionCardToBeDeleted.remove();
				const remainingCards = sessionList.querySelectorAll(".session-card");
                if (remainingCards.length === 0) {
					sessionList.querySelector(".card-container").remove();
					sessionList.innerHTML = `
						<div class="session-list__message">
							<div class="session-list__message-content">
								Hah >;3, looks like
								<strong>there is no sessions yet :d</strong>...
							</div>
						</div>
					`;
				}
			} else {
                throw new Error("Error deleting session occured");
			}
		} catch (err) {
            console.error(err);
        }
	});
});
