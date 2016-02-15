/// <reference path="../Immutable/Immutable.d.ts" />

declare module Immutable {
    export module Record {
        type IRecord<T> = T & TypedMap<T>;

        interface TypedMap<T> extends Map<string, any> {
            set<T>(key: string, value: any): IRecord<T>;
        }

        interface Factory<T> {
            new (): IRecord<T>;
            new (values: any): IRecord<T>;

            (): IRecord<T>;
            (values: any): IRecord<T>;
        }
    }

    export function Record<T>(
        defaultValues: T, name?: string
    ): Record.Factory<T>;
}
