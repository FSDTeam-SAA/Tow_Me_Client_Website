# Booking setup

Set `VITE_API_BASE_URL` and `VITE_TERMS_URL` in the website environment before
building. `VITE_TERMS_URL` must point to the approved, customer-facing Terms of
Use. The booking submit button remains disabled until this URL is present.

The booking page shows a cancellation-fee warning, and the customer receives
the exact current fee quote before confirming a cancellation.

Payment provider setup is pending. The page records only a preferred payment
method and does not collect card details or charge the customer. The backend
records trip completion as payment pending until settlement is confirmed.
