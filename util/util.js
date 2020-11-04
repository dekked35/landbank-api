class Util{
    duration(firstDate, lastDate){
        const start = new Date(firstDate);
        const end = new Date(lastDate);
        const duration = parseInt(((end.getTime() - start.getTime()) / (1000 * 3600 * 24))/30);
        return duration;
    }

    parkingLot(roomAmount){
        if (roomAmount > 99) {
            const mainParkingLot = 70 / 5;
            const extraParkingLot = ((roomAmount - 100) > 0) ? (roomAmount - 100)/10 : 0;

            return mainParkingLot + extraParkingLot;
        } else {
            return (roomAmount > 0) ? roomAmount/5 : 0;
        }
    }

    condoParkingLot(rooms, totalRoomArea, reducer, province){
        if (totalRoomArea <= 0){
            return 0;
        }
        if (!rooms.length) {
            return 0;
        }
        if (province === 'ภายนอกกรุงเทพ') {
            const bigRooms = (rooms.filter(room => room.area > 59).reduce(reducer))/2;
            const roomsByTotalArea = totalRoomArea/240;

            return (bigRooms >= roomsByTotalArea) ? bigRooms : roomsByTotalArea;
        } else {
            const bigRooms = rooms.filter(room => room.area > 59).reduce(reducer);
            const roomsByTotalArea = totalRoomArea/120;

            return (bigRooms >= roomsByTotalArea) ? bigRooms : roomsByTotalArea;
        }
    }

    parkingLotPercentage(parkingLots, rooms, reducer, province) {
        if (parkingLots <= 0) {
            return 0;
        }
        if (!rooms.length) {
            return 0;
        }

        const bigRooms = rooms.filter(room => room.area > 59).reduce(reducer);

        if (province === 'ภายนอกกรุงเทพ') {
            return (parkingLots * 100)/(bigRooms.noRoom/2);
        } else {
            return (parkingLots * 100)/bigRooms.noRoom;
        }
    }
}

module.exports = Util;