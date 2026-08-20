export type coordinate = {
    lng: number,
    lat: number
};

export type Transportation = "flight" | "driving" | "cycling" | "walking";

export class Spot {
    public name: string;
    public location: coordinate;
    public getHereBy: Transportation | null;
    public prev: Spot | null;
    public next: Spot | null;

    constructor(name: string, location: coordinate, getHereBy: Transportation | null, prev: Spot | null, next: Spot | null) {
        this.name = name;
        this.location = location;
        this.getHereBy = getHereBy;
        this.prev = prev;
        this.next = next;
    }

    public static builder() {
        return new this.Builder();
    }

    public clone() {
        return Spot.builder()
                    .name(this.name)
                    .location({
                        lng: this.location.lng,
                        lat: this.location.lat
                    })
                    .getHereBy(this.getHereBy)
                    .prev(null)
                    .next(null)
                    .build();
    }

    public static Builder = class {
        private _name: string = "";
        private _location: coordinate = {lng: 0, lat: 0};
        private _prev: Spot | null = null;
        private _next: Spot | null = null;
        private _getHereBy: Transportation | null = null;

        constructor() {
            return this;
        }

        public name(name: string) {
            this._name = name;
            return this;
        }

        public location(location: coordinate) {
            this._location = location;
            return this;
        }

        public getHereBy(transportation: Transportation | null) {
            this._getHereBy = transportation;
            return this;
        }

        public prev(prev: Spot | null) {
            this._prev = prev;
            return this;
        }

        public next(next: Spot | null) {
            this._next = next;
            return this;
        }

        public build() {
            return new Spot(this._name, this._location, this._getHereBy, this._prev, this._next);
        }
        

    }
}