const navLinkElements = document.querySelectorAll(".menu__list-link");
const windowPathname = window.location.pathname;                        // get current pathname (e.g., "/" or "/help")

navLinkElements.forEach((element) => {
	const navLinkPathname = new URL(element.href).pathname;             // get link pathname

	if (windowPathname === navLinkPathname) {
		element.classList.add("active");
	}
});
