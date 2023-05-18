import { EntityActionType } from '../enums/entity-action-type';

export interface EntityAction {
  action: EntityActionType;
  payload: any;
}
