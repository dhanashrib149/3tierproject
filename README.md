# 3-Tier Visual

A beginner-friendly, animated AWS architecture explainer. It tells the story of Ravi, a shop owner building an online shop inside a gated cloud neighbourhood. The diagram introduces the surrounding VPC network and grows step by step into a three-tier design: web, application, and database.

This is a static learning project. It does not connect to an AWS account, create resources, or represent a live deployment.

## The moving objects

| Moving object | What it represents |
|---|---|
| ✉️ Envelope | A visitor request entering the shop |
| 💾 Floppy disk | Data moving from web to app to database |
| 🔁 Repeat arrows | A database copy / replication path |
| 📦 Package | A software update leaving through NAT |
| 😈 Intruder | Unwanted traffic stopped by security rules |
| 🔒 Lock | The encrypted office VPN tunnel |
| 🤝 Handshake | A private VPC peering connection |

The packets travel along dashed SVG paths. The SVG uses `animateMotion` and `mpath`; motion is disabled by the browser when reduced-motion preferences are requested.

## The nine steps

1. **The fenced plot** — AWS Region and VPC (`10.0.0.0/16`). VPC means a fenced plot: an isolated network.
2. **Two buildings** — Availability Zones A and B: separate buildings in one AWS Region.
3. **Public and private rooms** — Subnets: smaller lobby / flat areas inside the fenced plot. Gold is public; purple is private.
4. **Open the main gate** — Internet Gateway, internet, visitors, route table and the visitor envelope.
5. **Add a receptionist** — Load Balancer distributes requests across web servers in both zones.
6. **The shop and its records** — App servers, primary database, live-copy database and replication path.
7. **A delivery counter** — NAT Gateway lets private resources make outbound connections for updates.
8. **Door guards and gate guards** — Security Groups (server door guards) and NACLs (subnet gate guards) stop an intruder.
9. **Office and partner road** — VPN (secret tunnel) from Ravi’s office and VPC Peering (private road) to a partner VPC.

## Plain-language glossary

| AWS term | Ravi’s neighbourhood analogy |
|---|---|
| VPC | Fenced plot |
| Subnet | Lobby / flats inside the plot |
| Internet Gateway | Main gate |
| NAT Gateway | Delivery counter |
| Security Group | Door guard for a resource |
| Network ACL (NACL) | Gate guard for a subnet |
| Load Balancer | Receptionist sharing visitors |
| VPN | Encrypted secret tunnel from an office |
| VPC Peering | Private road between two VPCs |
| Availability Zone | Separate building |
| Route table | Signpost showing where traffic should go |
| Web tier | Front counter that receives visitors |
| Application tier | Shop staff who do the work |
| Database tier | Record room that stores information |

## Run locally

No build step, package manager, or external JavaScript dependency is required.

1. Extract the ZIP.
2. Open a terminal in the `3tier-visual` folder.
3. Run:

```bash
python3 -m http.server 8000
```

4. Visit `http://localhost:8000` in your browser.

You can also open `index.html` directly, but using the local server is recommended for a consistent browser experience.

## Publish with GitHub Pages

1. Create or open a GitHub repository and upload the contents of the `3tier-visual` folder to the repository root (so `index.html`, `css/`, and `js/` are at the top level).
2. Commit and push the files to the `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, set Source to **Deploy from a branch**.
5. Choose branch **main** and folder **/ (root)**, then click **Save**.
6. Open the **Actions** tab and wait for the Pages build and deployment workflow to complete.
7. Use the published Pages URL shown in Settings → Pages.

If your repository already has a different root `index.html`, replacing it will change the website served at that repository’s Pages URL.

## Project structure

```text
3tier-visual/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── .nojekyll
├── LICENSE
└── README.md
```

## Customise the text and colours

- **Step text:** Edit the `steps` array near the top of `js/app.js`. Each step has `title`, `short`, `plain`, `technical`, and `watch` fields.
- **Step order / reveal:** Change the `level` values in `js/app.js`, or adjust the SVG component sections inside `buildDiagram()`.
- **Page colours:** Edit the CSS variables in `:root` at the top of `css/style.css`.
- **Diagram colours:** Edit the SVG classes such as `.region-box`, `.vpc-box`, `.public-box`, `.private-box`, `.component.red`, and `.component.green` in `css/style.css`.
- **Brand name:** Edit the header text and page title in `index.html`.

## Accessibility and responsive layout

- The diagram remains a dark, dotted night-sky canvas in both light and dark page themes.
- On narrow screens, the step list becomes a horizontal scrolling row and the diagram keeps a minimum width so labels remain readable.
- Buttons have visible keyboard focus outlines.
- The page respects `prefers-reduced-motion`.

## Technical notes

- The architecture is illustrative. Example CIDR ranges, region names and database paths are not instructions for a production design.
- A Multi-AZ standby is primarily for availability and failover; it is not normally a read-scaling target.
- A NAT Gateway allows outbound connections initiated from private subnets; it does not provide unsolicited inbound access.
- The diagram is designed to be understandable, not to scale. The SVG viewBox is `0 0 1100 620`.
