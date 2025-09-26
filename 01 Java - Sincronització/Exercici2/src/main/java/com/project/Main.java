package com.project;

import java.util.Random;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


public class Main {

    static final int NUM_MICROSERVICES = 5;
    static final int NUM_TASKS = 30;

    public static void main(String[] args) {

        ParkingLot parkingLot = new ParkingLot();
        Random rand = new Random();
        CountDownLatch done = new CountDownLatch(NUM_TASKS);

        ExecutorService executor = Executors.newFixedThreadPool(NUM_MICROSERVICES);

        for (int i = 0; i < NUM_TASKS; i++) {
            executor.execute(new Task(i, parkingLot.getSemaphore(), rand, done));
        }

        try {
            done.await(); // espera que totes acabin
            executor.shutdown();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
