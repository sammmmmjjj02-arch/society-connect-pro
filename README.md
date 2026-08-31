# Society Connect Pro

Build the foundation of a Society Management System for:

SAI BHAWANI CHS LTD

IMPORTANT:

This is a new project, but keep the implementation simple and

production-style. We have limited credits, so do NOT over-engineer

anything.

TECH STACK:

- React

- TypeScript

- Vite

- Tailwind CSS

- Use reusable components

- No unnecessary libraries

==================================================

CORE DESIGN SYSTEM

==================================================

The entire application must follow this visual identity:

Primary Navy:

#0F2D52

Accent Gold:

#D4AF37

White:

#FFFFFF

Light Gray:

#F8F9FA

Dark Gray:

#4B5563

Fonts:

- Headings: Cormorant Garamond

- Body/UI: Poppins

Design style:

- Premium

- Modern

- Minimal

- Clean

- Professional

- Elegant

- Society-management / corporate feel

- Senior-citizen friendly

- Excellent readability

- Proper spacing

- Responsive on desktop, tablet and mobile

DO NOT use:

- Flashy gradients

- Excessive animations

- Neon colors

- Glassmorphism-heavy UI

- Unnecessary decorative elements

- Overly complex layouts

The UI should feel premium without being complicated.

==================================================

IMPORTANT SCOPE RULE

==================================================

There will be NO public landing/home page.

When the website is opened:

Intro Animation

      ↓

Login Page

Do NOT create a public Home page.

==================================================

1. INTRO / OPENING ANIMATION

==================================================

Create a short, elegant intro animation when the application opens.

Show:

SAI BHAWANI CHS LTD

with a clean premium animation.

The animation should be:

- Short

- Smooth

- Professional

- Minimal

- Not flashy

After the animation automatically transition to:

/login

Do not make the user wait unnecessarily.

If an appropriate society logo is not available yet, use a clean

text-based placeholder area that can easily be replaced with the

actual logo later.

Do NOT invent a religious/god illustration or religious symbol.

==================================================

2. LOGIN PAGE

==================================================

Create the main Login page.

The login page should immediately follow the intro animation.

Login should support three roles:

Resident

Watchman

Admin

Use a clean role-selection interface.

The login page should contain:

- Society branding

- Role selector

- Username / Email field

- Password field

- Show/hide password

- Login button

- Forgot password UI placeholder

Keep the page compact and prevent unnecessary scrolling.

The login design must be premium and easy for older residents to use.

==================================================

3. ROLE-BASED ROUTING FOUNDATION

==================================================

Prepare basic frontend routing for:

/login

/resident

/watchman

/admin

For now, create simple placeholder dashboards for:

Resident Dashboard

Watchman Dashboard

Admin Dashboard

These placeholders should use the SAME design system.

Do not implement the complete dashboards yet.

The purpose of this task is only to establish the foundation and

routing.

==================================================

4. REUSABLE COMPONENTS

==================================================

Create reusable components for:

- Button

- Input

- Card

- Badge

- Page container

- Header

- Sidebar/navigation structure

Keep them simple.

Future pages must reuse these components instead of creating

different styles.

==================================================

5. FUTURE PROJECT SCOPE

==================================================

The final application will contain only the following important

modules.

RESIDENT:

- Dashboard

- Maintenance

- Payment

- Payment History

- Complaints

- Vehicle Search

- Profile

- Notices

WATCHMAN:

- Dashboard

- Visitors

- Parcels

- Vehicle Search

- Profile

ADMIN:

- Dashboard

- Residents

- Flats

- Maintenance

- Payment Verification

- Complaints

- Vehicles

- Notices

- Profile

SOCIETY CONTENT:

ONLY NOTICES.

Do NOT create:

- Public Home

- Gallery

- Events

- Public website pages

- Unnecessary modules

==================================================

VERY IMPORTANT

==================================================

For THIS task, implement ONLY:

1. Design system

2. Intro animation

3. Login page

4. Basic role-based routing

5. Placeholder Resident/Watchman/Admin dashboards

6. Reusable basic UI components

Do NOT implement:

- Maintenance functionality

- Payment functionality

- Complaints

- Vehicles

- Visitors

- Parcels

- Notices

- Admin management

- Backend

- Database

- Payment gateway

Those will be implemented later.

Do not add unnecessary features.

The priority is:

HIGH QUALITY UI

+

CLEAN FOUNDATION

+

REUSABLE COMPONENTS

+

MINIMAL COMPLEXITY

Make the UI polished and professional while keeping the codebase

simple and maintainable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a8c2c46d-cb5a-48ad-8156-be57899605f9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
