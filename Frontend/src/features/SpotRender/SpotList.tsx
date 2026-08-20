import { Spot, type coordinate } from "./Spot";

export class SpotList {
    public start: Spot | null;
    public end: Spot | null;
    public spots: number = 0;

    constructor() {
        this.start = null;
        this.end = null;
    }

    public isEmpty() {
        return this.spots === 0;
    }

    public addSpot(spot: Spot): void {
        if (this.isEmpty()) {
            this.start = spot;
            this.end = spot;
        }
        else {
            if (this.end) {
                spot.prev = this.end;
                this.end.next = spot;
                this.end = spot;
            }
        }
        this.spots++;
    }

    public getSpotsList() {
        let current: Spot | null = this.start;
        const list = [];
        while (current != null) {
            list.push({
                name: current.name,
                location: current.location
            });
            current = current.next;
        }
        return list;
    }


    public getTrips() {
        const trips = [];
        let current: Spot | null = this.start;
        while (current !== null) {
            if (current.next !== null) {
                trips.push({
                    start: current.location,
                    end: current.next.location,
                    transportation: current.getHereBy
                })
            }
            current = current.next;
        }

        return trips;
    }

    public clone() {
        const newList = new SpotList();
        let current: Spot | null = this.start;
        while (current !== null) {
            if (current !== null) {
                newList.addSpot(current.clone());
            }
            current = current.next;
        }
        return newList;
    }
}