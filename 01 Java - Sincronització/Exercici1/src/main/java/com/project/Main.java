package com.project;

import java.util.Arrays;
import java.util.Random;
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.CountDownLatch;

public class Main {

    static final int NUM_PROCESSES = 3;
    static Random rand;

    static float average = 0;
    static int sumatory = 0;
    static float stdDeviation = 0;

    public static void main(String[] args) {

        rand = new Random();
        CountDownLatch done = new CountDownLatch(2);

        int[] numbers = FillArrayOfIntegers();

        CyclicBarrier barrier = new CyclicBarrier(NUM_PROCESSES, new Runnable() {
            @Override
            public void run() {
                System.out.println(Arrays.toString(numbers));
                System.out.println("Realitzats els càlculs:");
                System.out.println("Mitjana: " + average);
                System.out.println("Sumatori: " + sumatory);
                System.out.println("Desviació estàndar: " + stdDeviation);
            }
        });

        ExecutorService executor = Executors.newFixedThreadPool(NUM_PROCESSES);

        Runnable microServiceSumatory = () -> {
            try {
                for (int i = 0; i < numbers.length; i++) {
                    sumatory += numbers[i];
                }

                done.countDown();
                barrier.await(); // Esperem que els altres fils acabin
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        };

        Runnable microServiceAverage = () -> {
            try {
                average = (float) sumatory / numbers.length;

                done.countDown();
                barrier.await(); // Esperem que els altres fils acabin
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        };

        Runnable microServiceStandardDeviation = () -> {
            try {
                float totalDiffSquared = 0;

                for (int i = 0; i < numbers.length; i++) {
                    totalDiffSquared += Math.pow(numbers[i] - average, 2);
                }

                stdDeviation = (float) Math.sqrt(totalDiffSquared / (numbers.length - 1));

                done.countDown();
                barrier.await(); // Esperem que els altres fils acabin
            } catch (InterruptedException | BrokenBarrierException e) {
                e.printStackTrace();
            }
        };

        executor.execute(microServiceSumatory);
        executor.execute(microServiceAverage);
        executor.execute(microServiceStandardDeviation);

        executor.shutdown();
    }

    public static int[] FillArrayOfIntegers() {

        int length = rand.nextInt(150);
        int[] numbers = new int[length];

        for (int i = 0; i < length; i++) {
            numbers[i] = rand.nextInt(0, 1000);
        }

        return numbers;
    }
}
