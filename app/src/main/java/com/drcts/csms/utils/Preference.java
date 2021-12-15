package com.drcts.csms.utils;


import android.content.Context;
import android.content.SharedPreferences;


/**
 * Shared Preference
 */
public class Preference {

    public static Context context;


    /**
     * Shared preference Name
     */
    private static final String mPrefName = "csms_preference";


    /**
     * 저장변수
     */
    private static final String PREF_DEVICE_NAME = "mLastConnectSuccessDeviceName";
    private static final String PREF_DEVICE_ADDRESS = "deviceAddress";



    public static void init(Context context) {
        Preference.context = context;
    }


    /**
     * Getter
     */
    public static String getDeviceName() {
        return getString(PREF_DEVICE_NAME);
    }
    public static String getDeviceAddress() {
        return getString(PREF_DEVICE_ADDRESS);
    }


    /**
     * Putter
     */
    public static void putDeviceName(String name) {
        putString(PREF_DEVICE_NAME, name);
    }
    public static void putDeviceAddress(String address) {
        putString(PREF_DEVICE_ADDRESS, address);
    }
















    /**
     * Common Setter of String value
     * @param key preference key
     * @param value String value
     */
    private static void putString(final String key, final String value) {
        SharedPreferences prefs = context.getSharedPreferences(mPrefName, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString(key, value);
        editor.apply();
    }


    /**
     * Common Getter of String value
     * @param key Preference key
     * @return if exist returns value
     *      otherwise, return Zero-length String
     */
    private static String getString(final String key) {
        return getString(key, "");
    }
    private static String getString(final String key, String defalut) {
        SharedPreferences prefs = context.getSharedPreferences(mPrefName, Context.MODE_PRIVATE);

        try {
            return prefs.getString(key, defalut);
        } catch (ClassCastException e) {
            return "";
        }
    }

    private static boolean getBoolean(final String key) {
        SharedPreferences prefs = context.getSharedPreferences(mPrefName, Context.MODE_PRIVATE);

        try {
            return prefs.getBoolean(key, false);
        } catch (Exception e) {
            return false;
        }
    }
    private static void putBoolean(final String key, final boolean value) {
        SharedPreferences prefs = context.getSharedPreferences(mPrefName, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putBoolean(key, value);
        editor.apply();
    }


    /**
     * Common Setter of int value
     * @param key preference key
     * @param value integer value
     */
    private static void putFloat(final String key, final float value) {
        SharedPreferences prefs = context.getSharedPreferences(mPrefName, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putFloat(key, value);
        editor.apply();
    }
    private static float getFloat(final String key) {
        SharedPreferences prefs = context.getSharedPreferences(mPrefName, Context.MODE_PRIVATE);

        try {
            return prefs.getFloat(key, Float.MIN_VALUE);
        } catch (ClassCastException e) {
            return Float.MIN_VALUE;
        }
    }



}
