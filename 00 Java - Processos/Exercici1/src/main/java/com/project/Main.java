package com.project;

import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {

    public static void main(String[] args) {

        int idTransaction = 100;
        
        ConcurrentHashMap<Integer, Double> transactions = new ConcurrentHashMap<Integer, Double>();
        ExecutorService executor = Executors.newFixedThreadPool(3);

        CountDownLatch awaitIncome = new CountDownLatch(1);
        CountDownLatch awaitRead = new CountDownLatch(1);

        Runnable addData = new Runnable() {
            
            @Override
            public void run() {
                try {
                    Thread.sleep(1500);
                    transactions.put(idTransaction, 350.25);
                    System.out.println("Es fa un ingrés de 350,25€");
                    awaitIncome.countDown();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        Runnable modifyData = new Runnable() {
            
            @Override
            public void run() {
                try {
                    awaitIncome.await();
                    Double num = (double)transactions.get(idTransaction);
                    double result = num - (num * 0.01);
                    transactions.replace(idTransaction, result);
                    Thread.sleep(1000);
                    System.out.println("Aplicant l'1% de comissions...");
                    awaitRead.countDown();
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        };

        Callable readData = new Callable<String>() {

            @Override
            public String call() {
                try {
                    awaitRead.await();
                    Double result = (double)transactions.get(idTransaction);
                    Thread.sleep(1000);
                    return "Afeing " + String.format("%.2f", result) + "€ al seu compte bancari";
                } catch (InterruptedException ex) {
                    System.out.println("Hem tingut problemes al procesar la operació");
                    return "";
                }
            }
        };

        executor.execute(addData);
        executor.execute(modifyData);

        try {
            System.out.println(readData.call());
        } catch (Exception e) {
            System.out.println("Hem tingut problemes al llegir la operació");
        }

        executor.shutdown();
    }
}
