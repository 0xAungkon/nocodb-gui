import type { Request } from 'express';
import type { TableType, UserType } from '~/lib/Api';
import { NcApiVersion } from './enums';

export interface NcContext {
  org_id?: string;
  workspace_id: string;
  base_id: string;
  api_version?: NcApiVersion;
  user?: UserType & {
    base_roles?: Record<string, boolean>;
    workspace_roles?: Record<string, boolean>;
    provider?: string;
  };
  fk_model_id?: string;
}

export interface NcRequest extends Partial<Request> {
  context: NcContext;
  ncWorkspaceId?: string;
  ncBaseId?: string;
  ncSourceId?: string;
  ncParentAuditId?: string;
  ncModel?: TableType;
  user: UserType & {
    base_roles?: Record<string, boolean>;
    workspace_roles?: Record<string, boolean>;
    provider?: string;
  };
  ncSiteUrl: string;
  dashboardUrl: string;
  clientIp?: string;
  query?: Record<string, any>;
  skipAudit?: boolean;
}

export type NcRecord<T = any> = Record<string, T>;
