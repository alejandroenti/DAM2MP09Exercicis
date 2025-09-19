package com.project;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {

    public static void main(String[] args) {
        
        ExecutorService executor = Executors.newFixedThreadPool(2);

        Runnable systemEvents = new Runnable() {
            
            @Override
            public void run() {
                try {
                    Thread.sleep(1000);
                    System.out.println("Event del sistema enregistrat");
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        };

        Runnable networkStatus = new Runnable() {
            
            @Override
            public void run() {
                try {
                    Thread.sleep(2000);
                    System.out.println("Tenim problemes amb la xarxa!");
                    System.out.println("Sortint del sistema...");
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        };

        executor.execute(systemEvents);
        executor.execute(networkStatus);

        executor.shutdown();
    }
}
