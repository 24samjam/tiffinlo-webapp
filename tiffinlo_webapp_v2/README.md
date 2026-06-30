# Tiffinlo Web App v2

Premium home style, pure veg and eggless tiffin subscription. Next.js. Pilot in Peenya and Yashwantpur, Bengaluru.

## Run it locally

1. Open a terminal inside this folder.
2. Install once:
   npm install
3. Create a file named `.env.local` (copy from `.env.local.example`) and add your Razorpay test keys.
4. Start it:
   npm run dev
5. Open http://localhost:3000

## What changed in v2

- Header: logo plus location selector with pincodes (Peenya 560058, Yashwantpur 560022). Language toggle removed. Social links added.
- Hero: headline cycles the same warm line across seven languages, the brand word tiffinlo stays constant.
- New storytelling and hygiene trust section.
- New menu showcase with horizontal sliding cards per cuisine, sample placeholder menu, no prices.
- Onboarding: animated avatar, a required input when someone picks "something else", home is a state dropdown, friendlier copy.
- Service journey rebuilt as a validated five step wizard: area, then days first, then plan with price computed from the chosen days, then delivery by day group, then review.
- Geography fields are validated dropdowns, no free typing.
- No symbols in copy.

## Notes

- Photos are temporary licensed stock placeholders from Unsplash. Swap with real photos of your Peenya kitchen and cooks. If an image ever fails to load, the layout falls back to a warm green panel, so nothing looks broken.
- The regional language lines in `data.js` are drafts. Get a native speaker to verify the Kannada, Tamil, Telugu, Gujarati and Malayalam lines before going live.
- Phone and OTP are simulated. Razorpay is in test mode.

## Structure

```
pages/        app shell, landing, signup, onboarding, journey, checkout, success
styles/       global css
data.js       areas, states, plans, menu, images, social
```
