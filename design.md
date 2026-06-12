I am working on an Angular project named KJUSYS-DutyAllotment-Frontend.

The project already has Faculty and Admin modules implemented.

Now the Faculty Figma design has changed.

I am attaching a zip file containing the updated Faculty Figma design screenshots/assets.

Your task is to modify ONLY the Faculty module frontend based on the updated Figma design.

Do not work on the Admin module now.

Admin updated Figma pages are not ready yet.

Later we will update Admin separately.

Focus only on Faculty module.

Use the attached Figma zip file as the main visual reference.

The final output must match the updated Faculty Figma design exactly.

Do not change the existing project workflow.

Do not change routing logic unnecessarily.

Do not change shared libraries.

Do not rewrite the whole project.

Only modify the required Faculty module files.

Use Tailwind CSS utility classes only.

Do not write custom CSS.

All .css files should remain empty.

If any styling is required, write it using Tailwind classes inside HTML.

Do not add new external CSS files.

Do not modify global styles.

Do not modify header, sidebar, footer, or shell layout unless the Figma specifically requires small alignment compatibility.

Use existing project libraries from KJUSYS-DutyAllotment-Frontend/libs.

Especially use the existing tabs and sub-tabs libraries.

Do not create custom tabs manually.

Use the existing @libs/tabs library for main Faculty tabs.

Use the existing @libs/sub-tabs library wherever sub-tabs are required.

Use the existing dropdown library from @libs/dropdown-lib if dropdowns are needed.

Do not change the source code of the libraries.

Only import and use the libraries.

Faculty module already has this structure:

faculty.component.html

faculty.component.ts

faculty.module.ts

faculty-routing.module.ts

dashboard/

assigned-duties/

swap-duties/

duty-history/

Keep this component structure.

Modify only the component HTML and TS files as required.

Use existing selector names.

Do not rename components.

Do not rename routes unless absolutely required.

The Faculty main tab bar must remain inside faculty.component.html.

The Faculty tab state must remain inside faculty.component.ts.

Use this existing pattern for main tabs:

<lib-tabs [tabs]="tabs" [activeTabId]="activeTabId" (tabChange)="onTabSelected($event)"></lib-tabs>

The child components should be shown using *ngIf based on activeTabId.

Maintain the same Faculty workflow:

Dashboard tab shows Faculty dashboard.

Assigned Duties tab shows assigned duties.

Upcoming Duties page or section should show upcoming duties.

Swap Duties tab shows swap request related content.

Duty History tab shows previous duty history.

Update the tab labels, subtitles, spacing, active state, and alignment according to the new Figma.

Use only the exact page content shown in the updated Faculty Figma.

Do not add extra UI that is not in Figma.

Do not remove required UI shown in Figma.

For Dashboard page:

Match the updated Faculty dashboard design exactly.

Use the correct cards, icons, count values, spacing, borders, shadows, font sizes, and layout.

Use SVG icons or existing icon library icons.

Do not use image icons unless the Figma asset specifically requires an image.

If icons are simple line icons, create them using inline SVG.

For Assigned Duties page:

Match the updated assigned duty design exactly.

Display duty cards/tables exactly as shown in Figma.

Each duty card must show duty type, event, date, time, venue/location, and status/details according to the Figma.

Add the Request Swap button exactly where shown in the design.

When the user clicks the Request Swap button, show a popup/modal in the center of the page.

The popup design is shown at the bottom of the Figma design.

Implement that popup exactly.

The popup must use Tailwind CSS only.

The popup must have a semi-transparent background overlay if shown in Figma.

The popup must be centered horizontally and vertically.

The popup details should be taken from the selected Exam Duty card.

The popup should show the selected duty details automatically.

In the popup, “Swap With” should be editable.

In the popup, “Reason for Swap” should be editable.

Other duty details should be read-only and populated from the selected duty card.

The popup must have buttons according to Figma, such as Cancel and Submit/Request.

Clicking Cancel should close the popup.

Clicking Submit/Request should close the popup and optionally show a simple frontend confirmation state/message if Figma shows it.

No backend integration is required now unless existing services are already present.

Use frontend mock data if backend is not connected.

For Upcoming Duties page or upcoming duties section:

Implement the same Request Swap popup behavior.

When clicking Request Swap from upcoming duty, open the same popup.

The popup data should come from the selected upcoming duty card.

Swap With and Reason fields should remain editable.

Keep the popup reusable if possible.

Use clean Angular state variables like selectedDuty, showSwapPopup, swapWith, and swapReason.

For Swap Duties page:

Match the updated Figma page exactly.

Show swap requests, request status, cards, buttons, or table according to the new design.

If Figma shows accept/reject buttons, implement frontend click handlers.

If Figma shows pending/approved/rejected states, use mock data and status badges.

For Duty History page:

Match the updated Figma duty history page exactly.

Use the correct search input, table/card layout, filters, date range, status badges, pagination, and typography from Figma.

Use mock data matching the Figma text.

Use exact colors from Figma as close as possible using Tailwind arbitrary values.

Use exact spacing with Tailwind arbitrary values where needed, for example w-[300px], mt-[40px], text-[14px].

Use Inter font classes if already configured.

Use font-medium, font-semibold, font-bold, and exact text sizes matching the screenshots.

For all pages:

Match Figma desktop layout first.

The target screen size is the same as the Figma screenshot.

Keep layout aligned with the existing header and sidebar.

Do not make components full screen if Figma content starts after sidebar/header.

Maintain proper content width and left margin according to the design.

Use white cards, light gray background, borders, shadows, and rounded corners exactly like Figma.

Use proper status badge colors.

Use correct pagination layout if shown.

Use exact labels and text from Figma.

Avoid unnecessary animations.

Avoid unnecessary responsive redesign.

Do not use Bootstrap classes unless already present and unavoidable.

Prefer Tailwind for everything.

Do not use inline CSS style attributes unless absolutely necessary.

Do not use separate CSS files.

Do not add new npm packages.

Do not change package.json.

Do not change library source files.

Do not change backend code.

Do not add backend calls unless existing services are already available.

If data is needed, define local mock arrays in the component TypeScript file.

Keep the mock data clean and easy to replace later with backend API data.

Use Angular event binding for buttons.

Use [(ngModel)] for editable popup fields if FormsModule is already imported.

If FormsModule is not imported in FacultyModule, import it.

Make sure FacultyModule imports:

CommonModule

FormsModule

FacultyRoutingModule

TabsModule from @libs/tabs

SubTabsModule from @libs/sub-tabs if needed

DropdownLibModule from @libs/dropdown-lib if needed

Do not remove existing module imports.

Check all component selectors before using them.

Make sure Angular templates compile without errors.

Fix all TypeScript and template errors.

Keep faculty.component.css empty.

Keep child component CSS files empty.

Only use HTML Tailwind classes and TypeScript logic.

After completing modifications, run/build mentally for Angular compatibility.

Make sure there are no unknown components, missing imports, missing properties, or wrong event names.

Before finishing, provide a short summary of modified files.

Also mention any assumptions made from the Figma zip.

Do not modify Admin module in this task.

Do not modify libraries in this task.

Do not change project workflow.

Only update Faculty module according to updated Figma design.