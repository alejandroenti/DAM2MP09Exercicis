package com.project;

import java.util.concurrent.Semaphore;

public class ParkingLot {

    private final int MAX_CAPACITY = 10;

    private final Semaphore semaphore = new Semaphore(MAX_CAPACITY);

    public Semaphore getSemaphore() {
        return semaphore;
    }

}
