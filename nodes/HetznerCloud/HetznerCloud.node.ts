import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

import { serverDescription } from './resources/server';
import { sshKeyDescription } from './resources/sshKey';
import { volumeDescription } from './resources/volume';
import { networkDescription } from './resources/network';
import { firewallDescription } from './resources/firewall';
import { loadBalancerDescription } from './resources/loadBalancer';
import { floatingIpDescription } from './resources/floatingIp';
import { primaryIpDescription } from './resources/primaryIp';
import { certificateDescription } from './resources/certificate';
import { imageDescription } from './resources/image';
import { placementGroupDescription } from './resources/placementGroup';
import { serverTypeDescription } from './resources/serverType';
import { loadBalancerTypeDescription } from './resources/loadBalancerType';
import { datacenterDescription } from './resources/datacenter';
import { locationDescription } from './resources/location';
import { isoDescription } from './resources/iso';
import { actionDescription } from './resources/action';
import { pricingDescription } from './resources/pricing';

import { getServers } from './listSearch/getServers';
import { getSshKeys } from './listSearch/getSshKeys';
import { getVolumes } from './listSearch/getVolumes';
import { getNetworks } from './listSearch/getNetworks';
import { getFirewalls } from './listSearch/getFirewalls';
import { getLoadBalancers } from './listSearch/getLoadBalancers';
import { getImages } from './listSearch/getImages';
import { getCertificates } from './listSearch/getCertificates';
import { getPlacementGroups } from './listSearch/getPlacementGroups';
import { getLocations } from './listSearch/getLocations';
import { getServerTypes } from './listSearch/getServerTypes';
import { getDatacenters } from './listSearch/getDatacenters';

export class HetznerCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Hetzner Cloud',
		name: 'hetznerCloud',
		icon: 'file:hetznerCloud.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage servers, volumes, networks and more in Hetzner Cloud',
		defaults: {
			name: 'Hetzner Cloud',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'hetznerCloudApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.hetzner.cloud',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Action', value: 'action' },
					{ name: 'Certificate', value: 'certificate' },
					{ name: 'Datacenter', value: 'datacenter' },
					{ name: 'Firewall', value: 'firewall' },
					{ name: 'Floating IP', value: 'floatingIp' },
					{ name: 'Image', value: 'image' },
					{ name: 'ISO', value: 'iso' },
					{ name: 'Load Balancer', value: 'loadBalancer' },
					{ name: 'Load Balancer Type', value: 'loadBalancerType' },
					{ name: 'Location', value: 'location' },
					{ name: 'Network', value: 'network' },
					{ name: 'Placement Group', value: 'placementGroup' },
					{ name: 'Pricing', value: 'pricing' },
					{ name: 'Primary IP', value: 'primaryIp' },
					{ name: 'Server', value: 'server' },
					{ name: 'Server Type', value: 'serverType' },
					{ name: 'SSH Key', value: 'sshKey' },
					{ name: 'Volume', value: 'volume' },
				],
				default: 'server',
			},
			...serverDescription,
			...sshKeyDescription,
			...volumeDescription,
			...networkDescription,
			...firewallDescription,
			...loadBalancerDescription,
			...floatingIpDescription,
			...primaryIpDescription,
			...certificateDescription,
			...imageDescription,
			...placementGroupDescription,
			...serverTypeDescription,
			...loadBalancerTypeDescription,
			...datacenterDescription,
			...locationDescription,
			...isoDescription,
			...actionDescription,
			...pricingDescription,
		],
	};

	methods = {
		listSearch: {
			getServers,
			getSshKeys,
			getVolumes,
			getNetworks,
			getFirewalls,
			getLoadBalancers,
			getImages,
			getCertificates,
			getPlacementGroups,
			getLocations,
			getServerTypes,
			getDatacenters,
		},
	};
}
