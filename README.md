# n8n-nodes-hetzner-cloud

This is an n8n community node. It lets you use the [Hetzner Cloud](https://www.hetzner.com/cloud) API in your n8n workflows.

Hetzner Cloud is an infrastructure-as-a-service platform for provisioning cloud servers, volumes, networks, load balancers and more.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Credentials](#credentials)
[Operations](#operations)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Install the package `@mookielianhd/n8n-nodes-hetzner-cloud`.

## Credentials

You need a Hetzner Cloud **API token**:

1. Sign in to the [Hetzner Cloud Console](https://console.hetzner.cloud/).
2. Select your project, then go to **Security → API tokens**.
3. Click **Generate API token**, give it Read & Write permissions, and copy the token (it is shown only once).
4. In n8n, create a new **Hetzner Cloud API** credential and paste the token.

API tokens are scoped to a single project. Use the **Test Connection** button to verify the token.

## Operations

The node exposes the following resources:

| Resource | Operations |
| --- | --- |
| Server | Create, Get, Get Many, Update, Delete, Power On/Off, Reboot, Reset, Shutdown, Rebuild, Change Type, Create Image, Enable/Disable Rescue, Attach/Detach ISO, Reset Password, Change Protection |
| SSH Key | Create, Get, Get Many, Update, Delete |
| Volume | Create, Get, Get Many, Update, Delete, Attach, Detach, Resize, Change Protection |
| Network | Create, Get, Get Many, Update, Delete, Add/Delete Subnet, Add/Delete Route, Change IP Range, Change Protection |
| Firewall | Create, Get, Get Many, Update, Delete, Set Rules, Apply to / Remove from Resources |
| Load Balancer | Create, Get, Get Many, Update, Delete, Add/Delete Service, Add/Remove Target, Change Algorithm/Type/Protection |
| Floating IP | Create, Get, Get Many, Update, Delete, Assign, Unassign, Change DNS PTR, Change Protection |
| Primary IP | Create, Get, Get Many, Update, Delete, Assign, Unassign, Change DNS PTR, Change Protection |
| Certificate | Create, Get, Get Many, Update, Delete, Retry |
| Image | Get, Get Many, Update, Delete, Change Protection |
| Placement Group | Create, Get, Get Many, Update, Delete |
| Server Type, Load Balancer Type, Datacenter, Location, ISO, Action | Get, Get Many (read-only) |
| Pricing | Get (read-only) |

Most create/action operations on servers, volumes and similar resources return an asynchronous
**Action** object alongside the resource — poll the **Action** resource to track completion.

Fields that aren't exposed directly can be set via the **Additional Body Fields (JSON)** input on
create/update operations. See the [Hetzner Cloud API reference](https://docs.hetzner.cloud/).

## Compatibility

Requires n8n with `n8nNodesApiVersion` 1. Tested against the Hetzner Cloud API v1.

## Resources

- [Hetzner Cloud API documentation](https://docs.hetzner.cloud/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
