package com.project;

import java.util.Random;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Semaphore;

public class Task extends Thread {

    private int num;
    private Semaphore slots;
    private Random rand;
    private CountDownLatch done;

    public Task(int num, Semaphore semaphore, Random rand, CountDownLatch done) {
        this.num = num;
        this.slots = semaphore;
        this.rand = rand;
        this.done = done;
    }

    @Override
    public void run() {
        try {
            slots.acquire(); // esperar slot del semàfor disponible

            System.out.println("Cotxe " + num + " busca aparcament");
            slots.acquire(); // Acquisició del semàfor
            System.out.println("Cotxe " + num + " troba aparcament. Bloqueja semàfor");

            // Simulem un treball amb el recurs
            Thread.sleep(rand.nextInt(500, 1500));

            System.out.println("Cotxe " + num + " surt de l'aparcament. Alliberant semàfor...");
            slots.release(); // Alliberació del semàfor

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            slots.release(); // free slot
            done.countDown(); // signal completion
        }
    }
}
