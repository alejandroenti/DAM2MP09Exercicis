package com.project;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {

    static final int NUM_MICROSERVICES = 3;

    public static void main(String[] args) {
        
        CyclicBarrier barrier = new CyclicBarrier(NUM_MICROSERVICES, new Runnable() {
            @Override
            public void run() {
                System.out.println("Tots els microserveis han acabat. Combinant els resultats...");
            }
        });

        ExecutorService executor = Executors.newFixedThreadPool(NUM_MICROSERVICES);

        Random rand = new Random();

        Runnable microServiceReadMemory = () -> {
            try {
                System.out.println("Microservei de comprovació de memòria iniciat...");
                Thread.sleep(rand.nextInt(1000, 5000));
                System.out.println("Microservei de comprovació de memòria completat.");
                barrier.await(); // Esperem que els altres fils acabin
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        };

        Runnable microServiceCheckDiskNodes = () -> {
            try {
                System.out.println("Microservei de lectura de nodes del disc dur iniciat...");
                Thread.sleep(rand.nextInt(3000, 10000));
                System.out.println("Microservei de lectura de nodes del disc completat.");
                barrier.await(); // Esperem que els altres fils acabin
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        };

        Runnable microServiceNetworkStatus = () -> {
            try {
                System.out.println("Microservei de comprovació de xarxa iniciat...");
                Thread.sleep(rand.nextInt(500, 2000));
                System.out.println("Microservei de comprovació de xarxa completat.");
                barrier.await(); // Esperem que els altres fils acabin
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        };

        executor.execute(microServiceReadMemory);
        executor.execute(microServiceCheckDiskNodes);
        executor.execute(microServiceNetworkStatus);

        executor.shutdown();
    }
}
