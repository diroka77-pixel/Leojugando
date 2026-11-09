package com.leojugando.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Color de fondo de las zonas que quedan libres alrededor de la app.
        getWindow().getDecorView().setBackgroundColor(Color.parseColor("#fff8ec"));

        // Si el móvil tiene la letra del sistema grande, la app no se agranda
        // (si no, los botones se salen por los lados de la pantalla).
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().getSettings().setTextZoom(100);
        }

        // Deja libres la cámara (muesca), la barra de estado y la de navegación,
        // para que ningún botón quede tapado por los bordes del móvil.
        View root = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets b = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );
            v.setPadding(b.left, b.top, b.right, b.bottom);
            return WindowInsetsCompat.CONSUMED;
        });
    }
}
