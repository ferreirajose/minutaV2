/**
 * Base DTO class that provides common fields and functionality
 */
export abstract class BaseDTO {
  /**
   * The unique identifier of the entity
   */
  id: string;

  /**
   * When the entity was created
   */
  createdAt: Date;

  /**
   * When the entity was last updated
   */
  updatedAt: Date;

  /**
   * Converts the DTO to a plain object
   */
  toJSON(): Record<string, any> {
    return { ...this };
  }

  /**
   * Creates a DTO instance from a plain object
   * @param data The data to create the DTO from
   */
  static fromPlainObject<T extends BaseDTO>(this: new () => T, data: Partial<T>): T {
    const instance = new this();
    Object.assign(instance, data);
    return instance;
  }
}
