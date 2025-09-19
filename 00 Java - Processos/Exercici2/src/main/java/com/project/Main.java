package com.project;

import java.util.HashMap;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {

    public static void main(String[] args) {

        ExecutorService exec = Executors.newFixedThreadPool(2, r -> {
            Thread t = new Thread(r);
            t.setDaemon(true);     // ajuda a no retenir el JVM
            return t;
        });

        try {
            CompletableFuture<HashMap<String, String>> recieveData =
                CompletableFuture.supplyAsync(() -> {
                    HashMap<String, String> map = new HashMap<String, String>();
                    map.put("name", "Alejandro");
                    map.put("email", "superemail@mail.co.uk");
                    map.put("method", "POST");
                    return map;
                }, exec);

            CompletableFuture<String> processData = recieveData.thenApplyAsync(result -> {
                String resultString = "";



                return resultString;
            }, exec);

            CompletableFuture<HashMap<Integer, String>> f3 = processData.thenApplyAsync(result -> {
                return new HashMap<Integer, String>() {200, result};
            }, exec);

            Integer finalResult = f3.join();   // o get()
            System.out.println("Resultat final: " + finalResult);
        } finally {
            exec.shutdown();                   // important!
        }
    }
}
