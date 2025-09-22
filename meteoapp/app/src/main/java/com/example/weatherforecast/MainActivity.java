package com.example.weatherforecast;

import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    private EditText editTextCity;
    private TextView textViewCity, textViewTemperature, textViewCondition, textViewHumidity;
    private Button buttonSearch;

    // INSERT YOUR API KEY HERE
    private static final String API_KEY = "YOUR_API_KEY_HERE";
    private static final String BASE_URL = "https://api.openweathermap.org/data/2.5/weather?q=";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize views
        editTextCity = findViewById(R.id.editTextCity);
        textViewCity = findViewById(R.id.textViewCity);
        textViewTemperature = findViewById(R.id.textViewTemperature);
        textViewCondition = findViewById(R.id.textViewCondition);
        textViewHumidity = findViewById(R.id.textViewHumidity);
        buttonSearch = findViewById(R.id.buttonSearch);

        // Set click listener for the search button
        buttonSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String city = editTextCity.getText().toString().trim();
                
                if (city.isEmpty()) {
                    Toast.makeText(MainActivity.this, "Please enter a city name", Toast.LENGTH_SHORT).show();
                    return;
                }
                
                // Fetch weather data
                new FetchWeatherTask().execute(city);
            }
        });
    }

    private class FetchWeatherTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... params) {
            String city = params[0];
            try {
                URL url = new URL(BASE_URL + city + "&appid=" + API_KEY + "&units=metric");
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder json = new StringBuilder(1024);
                String tmp;
                
                while((tmp = reader.readLine()) != null)
                    json.append(tmp).append("\n");
                reader.close();
                
                return json.toString();
            } catch (Exception e) {
                return null;
            }
        }

        @Override
        protected void onPostExecute(String json) {
            if (json == null) {
                Toast.makeText(MainActivity.this, "Failed to fetch weather data", Toast.LENGTH_SHORT).show();
                return;
            }

            try {
                JSONObject jsonObject = new JSONObject(json);
                
                // Parse city name
                String cityName = jsonObject.getString("name");
                
                // Parse temperature
                JSONObject main = jsonObject.getJSONObject("main");
                double temperature = main.getDouble("temp");
                
                // Parse weather condition
                String condition = jsonObject.getJSONArray("weather").getJSONObject(0).getString("main");
                
                // Parse humidity
                int humidity = main.getInt("humidity");
                
                // Update UI
                textViewCity.setText("City: " + cityName);
                textViewTemperature.setText("Temperature: " + temperature + "°C");
                textViewCondition.setText("Condition: " + condition);
                textViewHumidity.setText("Humidity: " + humidity + "%");
                
            } catch (Exception e) {
                Toast.makeText(MainActivity.this, "Failed to parse weather data", Toast.LENGTH_SHORT).show();
            }
        }
    }
}