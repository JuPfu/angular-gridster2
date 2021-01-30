import {Injectable} from '@angular/core';

import {GridsterComponentInterface} from './gridster.interface';
import {GridsterItem, GridsterItemComponentInterface} from './gridsterItem.interface';
import {CompactType} from './gridsterConfig.interface';

@Injectable()
export class GridsterCompact {

  constructor(private gridster: GridsterComponentInterface) {
  }

  destroy(): void {
    // @ts-ignore
    delete this.gridster;
  }

  checkCompact(): void {
    if (this.gridster.$options.compactType !== CompactType.None) {
      if (this.gridster.$options.compactType === CompactType.CompactUp) {
        this.checkCompactMovement(this.moveTillCollision, 'y', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeft) {
        this.checkCompactMovement(this.moveTillCollision, 'x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndLeft) {
        this.checkCompactMovement(this.moveTillCollision, 'y', -1);
        this.checkCompactMovement(this.moveTillCollision, 'x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeftAndUp) {
        this.checkCompactMovement(this.moveTillCollision, 'x', -1);
        this.checkCompactMovement(this.moveTillCollision, 'y', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactRight) {
        this.checkCompactMovement(this.moveTillCollision, 'x', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndRight) {
        this.checkCompactMovement(this.moveTillCollision, 'y', -1);
        this.checkCompactMovement(this.moveTillCollision, 'x', 1);
      } else if (this.gridster.$options.compactType === CompactType.CompactRightAndUp) {
        this.checkCompactMovement(this.moveTillCollision, 'x', 1);
        this.checkCompactMovement(this.moveTillCollision, 'y', -1);
      }
    }
  }

  checkCompactItem(item: GridsterItem): void {
    if (this.gridster.$options.compactType !== CompactType.None) {
      if (this.gridster.$options.compactType === CompactType.CompactUp) {
        this.moveTillCollision(item, 'y', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeft) {
        this.moveTillCollision(item, 'x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndLeft) {
        this.moveTillCollision(item, 'y', -1);
        this.moveTillCollision(item, 'x', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactLeftAndUp) {
        this.moveTillCollision(item, 'x', -1);
        this.moveTillCollision(item, 'y', -1);
      } else if (this.gridster.$options.compactType === CompactType.CompactUpAndRight) {
        this.moveTillCollision(item, 'y', -1);
        this.moveTillCollision(item, 'x', 1);
      }
    }
  }

  private checkCompactMovement(moveTillCollision: (item: GridsterItem, direction: string, delta: number) => boolean,
                               direction: string,
                               delta: number): void {
    let widgetMoved = false;
    this.gridster.grid.forEach((widget: GridsterItemComponentInterface) => {
      if (widget.$item.compactEnabled) {
        const moved = moveTillCollision(widget.$item, direction, delta);
        if (moved) {
          widgetMoved = true;
          widget.item[direction] = widget.$item[direction];
          widget.itemChanged();
        }
      }
    });
    if (widgetMoved) {
      this.checkCompact();
    }
  }

  private moveTillCollision(item: GridsterItem, direction: string, delta: number): boolean {
    item[direction] += delta;
    if (this.gridster.checkCollision(item)) {
      item[direction] -= delta;
      return false;
    } else {
      this.moveTillCollision(item, direction, delta);
      return true;
    }
  }
}
