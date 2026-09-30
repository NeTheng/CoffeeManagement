Technical Specification: Dynamic API Endpoints, Secure Local Caching, and Reactive Auth Management in Flutter
Version: 1.0.0
Target Framework: Flutter 3.x / Dart 3.x
Author: Software Engineering Team1.
Overview & Architecture StrategyThis specification details a robust, enterprise-grade architecture for managing
Dynamic Backend Endpoints, Secure Local Caching,
Multi-Flavor Build Configurations, and Reactive Authentication
Event Management within a Flutter application.
Key GoalsRuntime Endpoint Swapping: Dynamic resolution of host URLs and feature route paths sent from a remote configuration service.Resilient Fallback Hierarchy:

Fresh Remote Config
⟶
Encrypted KeyStore/Keychain Cache
⟶



Compile-Time Flavor Defaults
Fresh Remote Config⟶Encrypted KeyStore/Keychain Cache⟶Compile-Time Flavor Defaults
Zero-Downtime Reliability: Fast app startups using cached configurations while background synchronization happens seamlessly (Stale-While-Revalidate).Security First: Hardware-backed encryption (
256
-bit AES
256-bit AES) via FlutterSecureStorage for configuration payloads and Bearer tokens.Decoupled Auth Management: Global interception of 
401
 Unauthorized
401 Unauthorized events during failed token refreshes to force logout across state boundaries without relying on a BuildContext.2. Dynamic Data Models
ApiConfig Modellib/models/api_config.dartDart

import 'dart:convert';

class ApiConfig {
  final String baseUrl;
  final String userEndpoint;
  final String dynamicPath;
  final bool isMaintenanceMode;
  final String? maintenanceMessage;
  final bool isDeprecated;
  final String? deprecationMessage;
  final String? minSupportedAppVersion;

  ApiConfig({
    required this.baseUrl,
    required this.userEndpoint,
    required this.dynamicPath,
    this.isMaintenanceMode = false,
    this.maintenanceMessage,
    this.isDeprecated = false,
    this.deprecationMessage,
    this.minSupportedAppVersion,
  });

  factory ApiConfig.fromJson(Map<String, dynamic> json) {
    final flags = json['flags'] as Map<String, dynamic>? ?? {};
    final status = json['status'] as Map<String, dynamic>? ?? {};

    return ApiConfig(
      baseUrl: json['base_url'] ?? '',
      userEndpoint: json['user_endpoint'] ?? '',
      dynamicPath: json['dynamic_path'] ?? '',
      isMaintenanceMode: flags['maintenance_mode'] ?? false,
      maintenanceMessage: status['maintenance_message'],
      isDeprecated: flags['is_deprecated'] ?? false,
      deprecationMessage: status['deprecation_message'],
      minSupportedAppVersion: status['min_supported_version'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'base_url': baseUrl,
      'user_endpoint': userEndpoint,
      'dynamic_path': dynamicPath,
      'flags': {
        'maintenance_mode': isMaintenanceMode,
        'is_deprecated': isDeprecated,
      },
      'status': {
        'maintenance_message': maintenanceMessage,
        'deprecation_message': deprecationMessage,
        'min_supported_version': minSupportedAppVersion,
      },
    };
  }

  String toRawJson() => jsonEncode(toJson());

  factory ApiConfig.fromRawJson(String str) =>
      ApiConfig.fromJson(jsonDecode(str));
}
Uri Construction Helperslib/utils/api_uri_builder.dartDartimport '../models/api_config.dart';

extension ApiUriBuilder on ApiConfig {
  /// Safely constructs Uri instances with normalized paths and query strings
  Uri buildUri({
    required String path,
    List<String>? subPaths,
    Map<String, dynamic>? queryParameters,
  }) {
    final baseUri = Uri.parse(baseUrl);

    final List<String> segments = [
      ...baseUri.pathSegments.where((s) => s.isNotEmpty),
      ...path.split('/').where((s) => s.isNotEmpty),
      if (subPaths != null)
        ...subPaths.expand((s) => s.split('/')).where((s) => s.isNotEmpty),
    ];

    Map<String, String>? stringQueryParams;
    if (queryParameters != null && queryParameters.isNotEmpty) {
      stringQueryParams = queryParameters.map(
        (key, value) => MapEntry(key, value.toString()),
      );
    }

    return Uri(
      scheme: baseUri.scheme,
      host: baseUri.host,
      port: baseUri.hasPort ? baseUri.port : null,
      pathSegments: segments,
      queryParameters: stringQueryParams,
    );
  }
}
3. Environment Flavors Configurationlib/config/environment.dartDart

import '../models/api_config.dart';

enum Environment { dev, staging, prod }

class AppEnvironment {
  static const String _flavorString = String.fromEnvironment(
    'FLAVOR',
    defaultValue: 'prod',
  );

  static Environment get current {
    switch (_flavorString.toLowerCase()) {
      case 'dev':
      case 'development':
        return Environment.dev;
      case 'staging':
      case 'stg':
        return Environment.staging;
      case 'prod':
      case 'production':
      default:
        return Environment.prod;
    }
  }

  static ApiConfig get defaultConfig {
    switch (current) {
      case Environment.dev:
        return ApiConfig(
          baseUrl: 'https://dev-api.yourdomain.com',
          userEndpoint: '/v1/users',
          dynamicPath: '/v1/dev-features',
        );
      case Environment.staging:
        return ApiConfig(
          baseUrl: 'https://staging-api.yourdomain.com',
          userEndpoint: '/v1/users',
          dynamicPath: '/v1/features',
        );
      case Environment.prod:
        return ApiConfig(
          baseUrl: 'https://api.yourdomain.com',
          userEndpoint: '/v1/users',
          dynamicPath: '/v1/features',
        );
    }
  }

  static String get configUrl {
    switch (current) {
      case Environment.dev:
        return 'https://dev-api.yourdomain.com/v1/config';
      case Environment.staging:
        return 'https://staging-api.yourdomain.com/v1/config';
      case Environment.prod:
        return 'https://api.yourdomain.com/v1/config';
    }
  }
}
4. Secure Storage & Token Managerlib/services/token_manager.dartDart

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenManager {
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';

  final FlutterSecureStorage _storage;

  TokenManager({FlutterSecureStorage? storage})
      : _storage = storage ??
            const FlutterSecureStorage(
              aOptions: AndroidOptions(encryptedSharedPreferences: true),
              iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
            );

  Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(key: _accessTokenKey, value: accessToken);
    await _storage.write(key: _refreshTokenKey, value: refreshToken);
  }

  Future<String?> getAccessToken() => _storage.read(key: _accessTokenKey);
  Future<String?> getRefreshToken() => _storage.read(key: _refreshTokenKey);

  Future<void> clearTokens() async {
    await _storage.delete(key: _accessTokenKey);
    await _storage.delete(key: _refreshTokenKey);
  }

  Future<Map<String, String>> getDynamicHeaders({String? clientVersion}) async {
    final token = await getAccessToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
      if (clientVersion != null) 'X-App-Version': clientVersion,
    };
  }
}
5. Network Service & Dio Interceptor Layerlib/services/network_service.dartDart

import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/environment.dart';
import '../models/api_config.dart';
import 'token_manager.dart';

class NetworkService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final TokenManager _tokenManager = TokenManager();
  late final Dio dio;

  ApiConfig? _config;
  ApiConfig get config => _config ?? AppEnvironment.defaultConfig;

  String get _secureCacheKey => 'secure_api_config_${AppEnvironment.current.name}';

  final ValueNotifier<bool> maintenanceNotifier = ValueNotifier<bool>(false);
  final VoidCallback? onUnauthorized;

  NetworkService({this.onUnauthorized}) {
    dio = Dio(BaseOptions(baseUrl: config.baseUrl));

    dio.interceptors.add(
      QueuedInterceptorsWrapper(
        onRequest: (options, handler) async {
          options.baseUrl = config.baseUrl;
          final headers = await _tokenManager.getDynamicHeaders(clientVersion: '1.0.0');
          options.headers.addAll(headers);
          return handler.next(options);
        },
        onError: (DioException error, handler) async {
          if (error.response?.statusCode == 401) {
            final refreshed = await _attemptTokenRefresh();
            if (refreshed) {
              final opts = error.requestOptions;
              final newToken = await _tokenManager.getAccessToken();
              opts.headers['Authorization'] = 'Bearer $newToken';
              try {
                final response = await dio.fetch(opts);
                return handler.resolve(response);
              } catch (e) {
                return handler.next(error);
              }
            } else {
              // Trigger forced logout callback
              await _tokenManager.clearTokens();
              onUnauthorized?.call();
              return handler.reject(error);
            }
          }
          return handler.next(error);
        },
      ),
    );
  }

  Future<void> initializeConfig() async {
    // 1. Read Secure Storage Cache
    try {
      final cached = await _storage.read(key: _secureCacheKey);
      if (cached != null) {
        _config = ApiConfig.fromRawJson(cached);
        maintenanceNotifier.value = config.isMaintenanceMode;
      }
    } catch (_) {}

    // 2. Fetch Fresh Configuration from Network
    try {
      final response = await dio.get(AppEnvironment.configUrl);
      if (response.statusCode == 200) {
        final freshConfig = ApiConfig.fromJson(response.data);
        _config = freshConfig;
        maintenanceNotifier.value = freshConfig.isMaintenanceMode;
        await _storage.write(key: _secureCacheKey, value: freshConfig.toRawJson());
      }
    } catch (e) {
      debugPrint('Config sync failed, using cached/default: $e');
    }
  }

  Future<bool> _attemptTokenRefresh() async {
    final refresh = await _tokenManager.getRefreshToken();
    if (refresh == null) return false;

    try {
      final refreshDio = Dio();
      final response = await refreshDio.post(
        '${config.baseUrl}/v1/auth/refresh',
        data: {'refresh_token': refresh},
      );

      if (response.statusCode == 200) {
        await _tokenManager.saveTokens(
          accessToken: response.data['access_token'],
          refreshToken: response.data['refresh_token'],
        );
        return true;
      }
    } catch (_) {}
    return false;
  }
}
6. Reactive State & UI Gatewayslib/main.dartDart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'services/network_service.dart';

enum AuthStatus { authenticated, unauthenticated }

class AuthStateNotifier extends Notifier<AuthStatus> {
  @override
  AuthStatus build() => AuthStatus.authenticated;

  void forceLogout() {
    state = AuthStatus.unauthenticated;
  }

  void login() {
    state = AuthStatus.authenticated;
  }
}

final authProvider = NotifierProvider<AuthStateNotifier, AuthStatus>(
  AuthStateNotifier.new,
);

late final NetworkService networkService;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final container = ProviderContainer();

  networkService = NetworkService(
    onUnauthorized: () {
      container.read(authProvider.notifier).forceLogout();
    },
  );

  await networkService.initializeConfig();

  runApp(
    UncontrolledProviderScope(
      container: container,
      child: const MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    return MaterialApp(
      home: ValueListenableBuilder<bool>(
        valueListenable: networkService.maintenanceNotifier,
        builder: (context, isMaintenance, child) {
          if (isMaintenance) {
            return const Scaffold(
              body: Center(
                child: Text('App Under Maintenance. Please try again later.'),
              ),
            );
          }

          if (authState == AuthStatus.unauthenticated) {
            return const LoginScreen();
          }

          return const HomeScreen();
        },
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home Screen')),
      body: Center(
        child: Text('Active Base URL: ${networkService.config.baseUrl}'),
      ),
    );
  }
}

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: const Center(
        child: Text('Session expired. Please log in again.'),
      ),
    );
  }
}
7. Sample API Configuration Response PayloadWhen requesting GET /v1/config, the server returns:JSON

{
  "base_url": "https://dev-api.yourdomain.com",
  "user_endpoint": "/v1/users",
  "dynamic_path": "/v1/dev-features",
  "flags": {
    "maintenance_mode": false,
    "is_deprecated": false
  },
  "status": {
    "environment": "development",
    "maintenance_message": null,
    "deprecation_message": null,
    "min_supported_version": "1.0.0"
  }
}
8. Build & Execution CommandsExecution via Command LineBash# Development Build
flutter run --dart-define=FLAVOR=dev

# Staging Build
flutter run --dart-define=FLAVOR=staging

# Production Release Build
flutter build apk --release --dart-define=FLAVOR=prod
flutter build ipa --release --dart-define=FLAVOR=prod