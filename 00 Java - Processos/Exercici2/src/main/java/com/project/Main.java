package com.project;

import java.util.HashMap;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {

    public static void main(String[] args) {

        ExecutorService exec = Executors.newFixedThreadPool(2, r -> {
            Thread t = new Thread(r);
            t.setDaemon(true); // ajuda a no retenir el JVM
            return t;
        });

        try {
            CompletableFuture<HashMap<String, String>> recieveData = CompletableFuture.supplyAsync(() -> {
                HashMap<String, String> map = new HashMap<String, String>();
                map.put("name", "Alejandro");
                map.put("email", "superemail@mail.co.uk");
                map.put("method", "POST");
                return map;
            }, exec);

            CompletableFuture<String> processData = recieveData.thenApplyAsync(result -> {
                if (result.get("name") != "Alejandro")
                    return "Wrong name";
                if (result.get("email") != "superemail@mail.co.uk")
                    return "Wrong email";
                if (result.get("method") != "POST")
                    return "Wrong petion method";

                return "OK";
            }, exec);

            CompletableFuture<String> sendResponse = processData.thenApplyAsync(result -> {
                String response = "";

                if (result == "OK") {
                    response = String.format("{200: %s}", result);
                } else {
                    response = String.format("{401: %s}", result);
                }

                return response;
            }, exec);

            String finalResult = sendResponse.join(); // o get()
            System.out.println("Resultat final: " + finalResult);
        } finally {
            exec.shutdown(); // important!
        }
    }
}
