/* 3-Tier Visual — builds the step-by-step SVG diagram */
(() => {
  "use strict";

  const steps = [
    { title: "The fenced plot", short: "Ravi marks his cloud land", plain: "Ravi buys a fenced plot for his online shop. The fence keeps his shop’s network separate from other people’s networks.", technical: "A Virtual Private Cloud (VPC) is an isolated network in AWS. The example address range is 10.0.0.0/16.", watch: "A blue AWS Region appears first. Inside it, a teal fence marks Ravi’s VPC.", level: 1 },
    { title: "Two buildings", short: "Add two separate zones", plain: "Ravi builds in two separate buildings. If one building has a problem, the other can still help keep the shop available.", technical: "Availability Zones are separate data-centre locations within one AWS Region.", watch: "Two outlined buildings appear inside the VPC: Zone A and Zone B.", level: 2 },
    { title: "Public and private rooms", short: "Create the subnet spaces", plain: "Each building has a public lobby and private rooms. Visitors can reach the lobby, but private rooms are kept away from direct public access.", technical: "A subnet is a smaller IP range inside a VPC. Public subnets have a route to the Internet Gateway; private subnets do not need direct inbound internet access.", watch: "Gold public subnet areas and purple private subnet areas appear in both zones.", level: 3 },
    { title: "Open the main gate", short: "Let visitors enter", plain: "Ravi installs a main gate. Visitors arrive from the internet and follow the society’s route directions to the public area.", technical: "An Internet Gateway connects a VPC to the internet. A route table tells network traffic where to go.", watch: "The Internet, main gate, visitors and route-table label appear. An envelope travels through the gate.", level: 4 },
    { title: "Add a receptionist", short: "Share requests across zones", plain: "A receptionist welcomes visitors and sends each request to a suitable web counter in either building. This avoids sending everyone to one place.", technical: "A Load Balancer distributes incoming requests across targets such as web servers in multiple Availability Zones.", watch: "A load-balancer bar appears above two web servers. Envelopes split toward both zones.", level: 5 },
    { title: "The shop and its records", short: "Add app and database tiers", plain: "The web counters pass work to shop staff. Staff read and save records in the main record room. A live copy is kept in the second building.", technical: "The application tier runs business logic. The database tier stores information. A Multi-AZ database setup maintains a standby copy for availability.", watch: "App servers and a primary database appear. A floppy disk moves through web → app → database, while copy arrows move to Zone B.", level: 6 },
    { title: "A delivery counter", short: "Private servers get updates", plain: "Private rooms cannot open their own street-facing door. The delivery counter lets them request software updates outwards without inviting unsolicited visitors in.", technical: "A NAT Gateway allows resources in a private subnet to initiate outbound internet connections while preventing unsolicited inbound connections.", watch: "A NAT Gateway appears in the public subnet. A package travels from the private area through NAT and the main gate.", level: 7 },
    { title: "Door guards and gate guards", short: "Protect every entrance", plain: "A door guard checks who may enter each server. A gate guard checks traffic entering or leaving a whole subnet. An intruder is stopped before reaching the private rooms.", technical: "Security Groups are stateful virtual firewalls for resources. Network ACLs (NACLs) are stateless subnet-level traffic rules.", watch: "SG tags appear under servers and NACL tags on subnets. A red intruder moves toward the private subnet and is blocked.", level: 8 },
    { title: "Office and partner road", short: "Connect trusted networks", plain: "Ravi’s office gets a secret tunnel into the private area. A trusted business partner gets a separate private road to Ravi’s cloud plot.", technical: "A Site-to-Site VPN creates an encrypted connection from an office network to a VPC. VPC Peering privately connects two VPC networks.", watch: "An office, VPN gateway and green tunnel appear, plus a partner VPC linked by a private peering road.", level: 9 }
  ];

  const $ = (id) => document.getElementById(id);
  const svgNS = "http://www.w3.org/2000/svg";
  let currentStep = 0;
  let timer = null;
  let previousLevel = 0;

  function el(name, attrs = {}, parent) {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (parent) parent.appendChild(node);
    return node;
  }
  function text(parent, x, y, value, cls = "label", attrs = {}) {
    const t = el("text", { x, y, class: cls, ...attrs }, parent);
    t.textContent = value;
    return t;
  }
  function rect(parent, x, y, w, h, cls, rx = 12, extra = {}) {
    return el("rect", { x, y, width: w, height: h, rx, class: cls, ...extra }, parent);
  }
  function group(parent, cls = "") { return el("g", cls ? { class: cls } : {}, parent); }
  function wire(parent, id, d, cls = "wire") {
    const p = el("path", { id, d, class: cls }, parent);
    return p;
  }
  function packet(parent, emoji, pathId, begin = "0s", duration = "5s", repeat = "indefinite") {
    const t = el("text", { class: "packet", "text-anchor": "middle" }, parent);
    t.textContent = emoji;
    const motion = el("animateMotion", { dur: duration, begin, repeatCount: repeat, rotate: "auto" }, t);
    el("mpath", { href: `#${pathId}`, "xlink:href": `#${pathId}` }, motion);
    return t;
  }
  function boxLabel(parent, x, y, w, h, title, subtitle, cls = "component") {
    rect(parent, x, y, w, h, cls, 9);
    text(parent, x + w / 2, y + 24, title, "label", { "text-anchor": "middle", "font-size": 13 });
    if (subtitle) text(parent, x + w / 2, y + 42, subtitle, "tiny-label", { "text-anchor": "middle" });
  }
  function tag(parent, x, y, label, color = "#6d8eaf") {
    rect(parent, x, y, 75, 20, "tag", 7, { stroke: color });
    text(parent, x + 37.5, y + 14, label, "tag-text", { "text-anchor": "middle" });
  }

  function buildDiagram(level) {
    const svg = el("svg", { viewBox: "0 0 1100 620", class: "arch-svg", role: "img", "aria-label": `AWS three-tier architecture diagram, step ${level} of 9` });
    const defs = el("defs", {}, svg);
    const gradient = el("linearGradient", { id: "sky", x1: "0", y1: "0", x2: "1", y2: "1" }, defs);
    el("stop", { offset: "0%", "stop-color": "#102747" }, gradient);
    el("stop", { offset: "100%", "stop-color": "#07142b" }, gradient);
    const pattern = el("pattern", { id: "dots", width: "24", height: "24", patternUnits: "userSpaceOnUse" }, defs);
    el("circle", { cx: "2", cy: "2", r: "1.1", fill: "#45617e", opacity: ".45" }, pattern);

    rect(svg, 0, 0, 1100, 620, "", 0, { fill: "url(#sky)" });
    rect(svg, 0, 0, 1100, 620, "", 0, { fill: "url(#dots)" });

    const base = group(svg);
    // Outer region and VPC boundaries are always visible from step 1.
    rect(base, 30, 26, 1040, 568, "region-box", 18);
    text(base, 54, 58, "AWS REGION · example: eu-north-1", "label");
    rect(base, 52, 78, 996, 494, "vpc-box", 16);
    text(base, 76, 111, "RAVI’S VPC · 10.0.0.0/16", "label");
    text(base, 76, 132, "The fenced plot — Ravi’s private cloud network", "small-label");

    // Wires are drawn before the component boxes and packets.
    const wires = group(svg);
    if (level >= 4) {
      wire(wires, "internet-path", "M 12 275 L 155 275 L 235 275 L 315 275", "wire gold-wire");
      wire(wires, "visitor-path", "M 315 275 C 360 275 365 220 415 220", "wire gold-wire");
      wire(wires, "visitor-to-lb", "M 415 220 C 480 220 480 175 545 175", "wire gold-wire");
    }
    if (level >= 5) {
      wire(wires, "lb-web-a", "M 550 194 C 500 220 420 245 360 285", "wire gold-wire");
      wire(wires, "lb-web-b", "M 550 194 C 650 220 720 245 790 285", "wire gold-wire");
    }
    if (level >= 6) {
      wire(wires, "web-app-a", "M 360 318 L 360 382", "wire");
      wire(wires, "web-app-b", "M 790 318 L 790 382", "wire");
      wire(wires, "app-db", "M 405 420 C 465 465 520 465 570 450", "wire purple-wire");
      wire(wires, "db-replica", "M 625 462 C 700 510 790 510 850 462", "wire purple-wire");
    }
    if (level >= 7) {
      wire(wires, "nat-update", "M 930 300 L 930 347 L 217 347 L 217 313 L 217 275", "wire gold-wire");
    }
    if (level >= 8) {
      wire(wires, "intruder-path", "M 1080 505 C 1025 505 1005 530 960 530 L 920 530", "wire red-wire");
    }
    if (level >= 9) {
      wire(wires, "vpn-path", "M 100 535 C 150 535 165 500 205 500 L 205 450 C 205 425 245 425 280 425", "wire green-wire");
      wire(wires, "peer-path", "M 1048 160 L 1080 160", "wire green-wire");
    }

    // Availability Zone buildings.
    if (level >= 2) {
      const zones = group(svg, level > previousLevel ? "new-piece" : "");
      rect(zones, 80, 158, 445, 386, "zone-box", 13);
      rect(zones, 575, 158, 445, 386, "zone-box", 13);
      text(zones, 100, 185, "AVAILABILITY ZONE A · BUILDING 1", "small-label");
      text(zones, 595, 185, "AVAILABILITY ZONE B · BUILDING 2", "small-label");
    }

    // Subnets.
    if (level >= 3) {
      const subs = group(svg, level > previousLevel ? "new-piece" : "");
      rect(subs, 98, 205, 408, 135, "public-box", 10);
      rect(subs, 98, 355, 408, 168, "private-box", 10);
      rect(subs, 592, 205, 408, 135, "public-box", 10);
      rect(subs, 592, 355, 408, 168, "private-box", 10);
      text(subs, 115, 229, "PUBLIC SUBNET A", "small-label");
      text(subs, 115, 379, "PRIVATE SUBNET A", "small-label");
      text(subs, 609, 229, "PUBLIC SUBNET B", "small-label");
      text(subs, 609, 379, "PRIVATE SUBNET B", "small-label");
      text(subs, 115, 248, "10.0.1.0/24", "tiny-label");
      text(subs, 115, 398, "10.0.11.0/24", "tiny-label");
      text(subs, 609, 248, "10.0.2.0/24", "tiny-label");
      text(subs, 609, 398, "10.0.12.0/24", "tiny-label");
    }

    // Internet and gate.
    if (level >= 4) {
      const internet = group(svg, level > previousLevel ? "new-piece" : "");
      boxLabel(internet, 12, 235, 112, 78, "THE INTERNET", "Visitors arrive", "component gold");
      boxLabel(internet, 155, 235, 125, 78, "MAIN GATE", "Internet Gateway", "component gold");
      boxLabel(internet, 285, 235, 115, 78, "ROUTE TABLE", "Traffic directions", "component");
      boxLabel(internet, 425, 197, 140, 48, "VISITORS", "Incoming requests", "component gold");
      packet(internet, "✉️", "internet-path", "0s", "6s");
    }

    // Load balancer and web tier.
    if (level >= 5) {
      const tier = group(svg, level > previousLevel ? "new-piece" : "");
      boxLabel(tier, 548, 158, 210, 48, "LOAD BALANCER", "Receptionist · shares requests", "component gold");
      boxLabel(tier, 280, 275, 160, 48, "WEB SERVER A", "Zone A · front counter", "component");
      boxLabel(tier, 710, 275, 160, 48, "WEB SERVER B", "Zone B · front counter", "component");
      packet(tier, "✉️", "lb-web-a", "1s", "4s");
      packet(tier, "✉️", "lb-web-b", "2s", "4s");
    }

    // Application and data tiers.
    if (level >= 6) {
      const data = group(svg, level > previousLevel ? "new-piece" : "");
      boxLabel(data, 280, 382, 160, 48, "APP SERVER A", "Shop staff", "component teal");
      boxLabel(data, 710, 382, 160, 48, "APP SERVER B", "Shop staff", "component teal");
      boxLabel(data, 475, 445, 175, 52, "PRIMARY DATABASE", "Main record room", "component purple");
      boxLabel(data, 775, 445, 175, 52, "LIVE COPY DB", "Zone B · standby", "component purple");
      packet(data, "💾", "web-app-a", "0s", "3.8s");
      packet(data, "💾", "app-db", "1s", "4s");
      packet(data, "🔁", "db-replica", "0s", "5s");
    }

    // NAT gateway.
    if (level >= 7) {
      const nat = group(svg, level > previousLevel ? "new-piece" : "");
      boxLabel(nat, 875, 270, 115, 55, "NAT GATEWAY", "Delivery counter", "component gold");
      packet(nat, "📦", "nat-update", "0s", "6s");
    }

    // Security controls and intruder.
    if (level >= 8) {
      const sec = group(svg, level > previousLevel ? "new-piece" : "");
      // Security Group tags under each server / database.
      tag(sec, 320, 328, "SG guard", "#ef7777");
      tag(sec, 750, 328, "SG guard", "#ef7777");
      tag(sec, 322, 435, "SG guard", "#ef7777");
      tag(sec, 752, 435, "SG guard", "#ef7777");
      tag(sec, 520, 503, "SG guard", "#ef7777");
      // NACL tags on subnet edges.
      tag(sec, 420, 210, "NACL", "#ef7777");
      tag(sec, 915, 210, "NACL", "#ef7777");
      tag(sec, 420, 505, "NACL", "#ef7777");
      tag(sec, 915, 505, "NACL", "#ef7777");
      boxLabel(sec, 935, 470, 120, 58, "BLOCKED!", "Intruder stopped", "component red");
      packet(sec, "😈", "intruder-path", "0s", "4s");
      text(sec, 988, 553, "Red rules stop the intruder", "tiny-label", { "text-anchor": "middle", fill: "#ffaaaa" });
      el("path", { d: "M 967 484 L 1001 518 M 1001 484 L 967 518", stroke: "#ff6868", "stroke-width": 5, "stroke-linecap": "round" }, sec);
    }

    // Office VPN and partner peering.
    if (level >= 9) {
      const links = group(svg, level > previousLevel ? "new-piece" : "");
      rect(links, 18, 470, 115, 83, "office-box", 10);
      text(links, 75, 495, "RAVI’S OFFICE", "small-label", { "text-anchor": "middle" });
      text(links, 75, 516, "Office network", "tiny-label", { "text-anchor": "middle" });
      boxLabel(links, 145, 468, 125, 55, "VPN GATEWAY", "Secret tunnel", "component green");
      packet(links, "🔒", "vpn-path", "0s", "5s");
      rect(links, 960, 95, 125, 72, "partner-box", 11);
      text(links, 1022, 122, "PARTNER VPC", "small-label", { "text-anchor": "middle" });
      text(links, 1022, 143, "10.2.0.0/16", "tiny-label", { "text-anchor": "middle" });
      boxLabel(links, 850, 180, 150, 48, "VPC PEERING", "Private road", "component green");
      packet(links, "🤝", "peer-path", "0s", "4s");
    }

    // A small three-tier key is always visible and reinforces the concept.
    const key = group(svg);
    text(key, 78, 578, "THREE TIERS:", "tiny-label");
    text(key, 190, 578, "WEB  →  APPLICATION  →  DATABASE", "small-label");
    text(key, 770, 578, "BLUE: CLOUD   GOLD: PUBLIC   PURPLE: PRIVATE", "tiny-label");

    return svg;
  }

  function render() {
    const step = steps[currentStep];
    $("stepList").replaceChildren();
    steps.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `step-button${index === currentStep ? " active" : ""}`;
      button.setAttribute("aria-current", index === currentStep ? "step" : "false");
      button.innerHTML = `<span class="step-number">${index + 1}</span><span class="step-copy"><strong></strong><small></small></span>`;
      button.querySelector("strong").textContent = item.title;
      button.querySelector("small").textContent = item.short;
      button.addEventListener("click", () => {
        stopAutoPlay();
        currentStep = index;
        render();
      });
      $("stepList").appendChild(button);
    });

    $("diagramMount").replaceChildren(buildDiagram(step.level));
    $("diagramTitle").textContent = "Ravi’s cloud neighbourhood";
    $("progress").textContent = `STEP ${currentStep + 1} OF ${steps.length}`;
    $("captionNumber").textContent = String(currentStep + 1).padStart(2, "0");
    $("captionTitle").textContent = step.title;
    $("plainWords").textContent = step.plain;
    $("technicalName").textContent = step.technical;
    $("watchPicture").textContent = step.watch;
    $("previousStep").disabled = currentStep === 0;
    $("nextStep").textContent = currentStep === steps.length - 1 ? "Start again ↻" : "Next step →";
    previousLevel = step.level;
  }

  function stopAutoPlay() {
    if (timer) window.clearInterval(timer);
    timer = null;
    $("autoPlay").setAttribute("aria-pressed", "false");
    $("autoPlay").textContent = "▶ Auto-play";
  }
  function startAutoPlay() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      $("watchPicture").textContent += " Auto-play is available, but your device prefers reduced motion.";
    }
    $("autoPlay").setAttribute("aria-pressed", "true");
    $("autoPlay").textContent = "Ⅱ Pause";
    timer = window.setInterval(() => {
      currentStep = (currentStep + 1) % steps.length;
      render();
    }, 5000);
  }

  $("previousStep").addEventListener("click", () => {
    stopAutoPlay();
    if (currentStep > 0) currentStep -= 1;
    render();
  });
  $("nextStep").addEventListener("click", () => {
    stopAutoPlay();
    currentStep = (currentStep + 1) % steps.length;
    render();
  });
  $("reset").addEventListener("click", () => {
    stopAutoPlay();
    currentStep = 0;
    render();
  });
  $("autoPlay").addEventListener("click", () => timer ? stopAutoPlay() : startAutoPlay());
  $("themeToggle").addEventListener("click", () => document.body.classList.toggle("dark"));

  render();
})();
