import { useParams } from 'react-router-dom';
import type { Role } from './prototype';
import { WORKSPACES, type Workspace } from './sample';

export function workspaceForRole(role: Role): Workspace {
  if (role === 'business') return WORKSPACES.business;
  if (role === 'consultant') return WORKSPACES.consultant;
  return WORKSPACES.agency; // owner, member, platform (akses tercatat)
}

export function homePath(role: Role, clientId?: string): string {
  if (role === 'client') return '/portal';
  const ws = workspaceForRole(role);
  return `/w/${ws.id}/c/${clientId ?? ws.clients[0].id}/dashboard`;
}

/** Workspace & klien aktif dari URL /w/:ws/c/:client/... */
export function useScope() {
  const { ws: wsId, client: clientId } = useParams();
  const ws = Object.values(WORKSPACES).find((w) => w.id === wsId) ?? WORKSPACES.agency;
  const client = ws.clients.find((c) => c.id === clientId) ?? ws.clients[0];
  return { ws, client, base: `/w/${ws.id}/c/${client.id}` };
}
